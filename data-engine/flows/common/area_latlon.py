import pandas as pd
import numpy as np

from prefect import task, flow
from prefect.task_runners import ConcurrentTaskRunner

from flows.shared import refresh_table

from ion_clients.clients.common.area_latlon import geonames_info
from ion_clients.clients.common.types.area_latlon import GeoNamesData
from ion_clients.services.postgres.schemas.area_latlon import AreaLatLon

@task
def ingest_geonames():
    data: GeoNamesData = geonames_info()
    return data

@task 
def clean_geonames(data: GeoNamesData):
    required_columns = [col.name for col in AreaLatLon.__table__.columns]
    data = pd.DataFrame(data, GeoNamesData, GeoNamesData.__fields__.keys()).drop_duplicates()
    data = data[required_columns]
    
    # typecast
    data.geoname_id = data.geoname_id.astype(np.int32)
    data.latitude = data.latitude.astype(np.float32)
    data.longitude = data.longitude.astype(np.float32)
    data.population = data.population.astype(np.int32)
    data.dem = data.dem.astype(np.int16)
    
    return data.to_dict("records")

@flow(
    task_runner=ConcurrentTaskRunner(),
    name="Geonames Scraper Flow",
    description="Scheduled prefect pipeline for extracting city to longitude:latitude information.",
)
def geonames_ingestion_flow():
    geonames = ingest_geonames().submit().result()
    geonames = clean_geonames(geonames).submit.result()
    refresh_table(AreaLatLon, geonames).submit.result()
    