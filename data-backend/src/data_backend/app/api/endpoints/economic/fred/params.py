from pydantic import BaseModel

class FredChildParams(BaseModel):
    category_id: int
    
class FredSeriesParams(BaseModel):
    series_id: str
    
class FredSearchParams(BaseModel):
    search_term: str
    limit: int 