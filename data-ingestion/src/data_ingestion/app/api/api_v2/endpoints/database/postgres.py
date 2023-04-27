from typing import Literal
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from data_ingestion.app.api.api_v2.postgres.actions import (
    order_query,
    get_session,
)
from data_ingestion.app.api.api_v2.postgres.models.infra.portfolio import (
    Portfolio,
)
from data_ingestion.app.api.api_v2.postgres.schemas.infra.portfolio.params import (
    PortfolioParams,
)
from data_ingestion.app.api.api_v1.models.database.postgres.tables import (
    tables as postgres_tables,
)
from data_ingestion.app.api.api_v1.models.database.postgres.params import (
    TableQueryParams,
)

router = APIRouter(
    prefix="/postgres",
    tags=["database", "postgres"],
)

query_tables = {
    Portfolio.__tablename__: Portfolio,
}


@router.get("/health", tags=["health"])
def health_check():
    return {"status": "healthy"}


@router.post("/query")
def query_postgres_table(
    params: TableQueryParams, session: Session = Depends(get_session)
):
    return order_query(
        postgres_tables[params.table],
        session,
        postgres_tables[params.table]._date,
    )


@router.get("/{table_name}")
def get_postgres_table(
    table_name: str,
    session: Session = Depends(get_session),
):
    items = session.query(query_tables[table_name]).all()
    return items


@router.delete("/{table_name}")
def delete_postgres_table_entry(
    id: int,
    table_name: str,
    session: Session = Depends(get_session),
):
    entry = session.query(query_tables[table_name]).get(id)
    session.delete(entry)
    return


@router.post("/{table_name}")
def insert_postgres_table_entry(
    table_name: str,
    entry: PortfolioParams,
    session: Session = Depends(get_session),
):
    session.add(query_tables[table_name](**entry.dict()))
    return


@router.put("/{table_name}")
def update_postgres_table_entry(
    table_name: str,
    id: str,
    replacement_entry: PortfolioParams,
    session: Session = Depends(get_session),
):
    session.query(query_tables[table_name]).get(id).update(replacement_entry)
