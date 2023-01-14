import uuid
from typing import Dict, List, Union, Any
from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime,
    Boolean,
    Table,
    BigInteger,
)

from ion_clients.services.postgres.schemas.base import Base
from ion_clients.services.postgres.actions import bulk_upsert
from ion_clients.core.utils.type_detect import ParseableTypes, TypeDetectEntry


def initialise_dynamic_table(
    session,
    schema: Dict[str, TypeDetectEntry],
    data: List[List[Any]],
):
    """Creates a table schema and bulk insert the data specified into the database dynamically.

    Args:
        session (_type_): _description_
        schema (Dict[str, TypeDetectEntry]): _description_
        data (List[List[Any]]): _description_

    Returns:
        _type_: _description_
    """

    kwargs = {"nullable": False}
    schema_mapper: Dict[
        TypeDetectEntry, Union[Integer, Float, String, DateTime, Boolean]
    ] = {
        "FLOAT": Float,
        "TEXT": String,
        "INT": Integer,
        "BIGINT": BigInteger,
        "BOOL": Boolean,
        "DATETIME": DateTime,
        "BLANK": String,
    }

    primary_key_available = False

    table_columns: List[Column] = []
    for col in schema.keys():
        if schema[col]["nullable"]:
            kwargs["nullable"] = True
        if schema[col]["primary_key"]:
            kwargs["primary_key"] = True
            primary_key_available = True
        table_columns.append(
            Column(col, schema_mapper[schema[col]["type_guessed"]], **kwargs)
        )
    # Create a primary key if its not available
    if not primary_key_available:
        table_columns.append(
            Column("uuid", String, primary_key=True, nullable=False)
        )

    table_id = uuid.uuid4().hex

    table_schema = Table(
        table_id,
        Base.metadata,
        *table_columns,
    )
    table_schema = type(
        table_id,
        (Base,),
        {"__tablename__": table_id, "__table__": table_schema},
    )
    table_schema.metadata = table_schema.__table__.metadata

    # Create write object
    write_object = []
    for row in data:
        entry = {}
        for index, col in enumerate(schema.keys()):
            null_checker: int = 0
            if len(row) != 0:
                el = row[index]
                if el == "":
                    el = None
                entry[col] = el
                if not el:
                    null_checker += 1
        if not primary_key_available:
            entry["uuid"] = uuid.uuid4()
        if null_checker != len(row):
            write_object.append(entry)

    bulk_upsert(session, table_schema, write_object, upsert_key=None)

    return table_id
