import pandas as pd
from typing import List
from fastapi import APIRouter
from datetime import datetime, timedelta

from ion_clients.clients.fred import get_children_category_ids
from ion_clients.services.postgres.models.data.government import FredMetaData
from ion_clients.services.postgres.postgres_service import _get_postgres_engine
from data_ingestion.app.api.api_v2.postgres.schemas.data.government.params import (
    FredChildParams,
)

router = APIRouter(
    tags=["government"],
)


@router.get("/health")
def health_check():
    return {"status": "healthy"}


@router.post("/child")
def get_fred_child_nodes(params: FredChildParams):
    return get_children_category_ids(params.category_id)


@router.get("/root")
def get_fred_parent_nodes():
    with _get_postgres_engine().connect() as conn:
        df: pd.DataFrame = pd.read_sql(FredMetaData.__tablename__, conn)
        df_update_condition = df[
            "last_updated"
        ] < datetime.today() - timedelta(days=7)

        root_id = 0
        l1_child_nodes = []

        if df.empty or df[df_update_condition].shape[0] != 0:
            # ID 0 is the top root node. We get the children
            data = get_children_category_ids(root_id)
            parent_nodes = data["data"]
            # Now we treat these children as parent nodes to get their children
            for parent_node in parent_nodes:
                time_now = datetime.now()
                parent_node["last_updated"] = time_now
                l1_child_nodes.append(
                    {
                        "parent_node": parent_node,
                        "child_node": [
                            *map(
                                lambda s: {**s, "last_updated": time_now},
                                get_children_category_ids(parent_node["id"])[
                                    "data"
                                ],
                            )
                        ],
                    }
                )
            # Format data for writing into DB, since it does not exist
            data = []
            for entry in l1_child_nodes:
                data.append(entry["parent_node"])
                data += entry["child_node"]
            pd.DataFrame(data).to_sql(
                FredMetaData.__tablename__,
                conn,
                if_exists="replace",
                index=False,
            )

        else:
            df = pd.read_sql(FredMetaData.__tablename__, conn)
            for _id in df[df["parent_id"] == 0].id.unique():
                l1_child_nodes.append(
                    {
                        "parent_node": df[df["id"] == _id].to_dict("records")[
                            0
                        ],
                        "child_node": df[df["parent_id"] == _id].to_dict(
                            "records"
                        ),
                    }
                )
        return l1_child_nodes
