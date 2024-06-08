from stringcase import camelcase
import pydantic


class BaseModel(pydantic.BaseModel):
    class Config:
        alias_generator = camelcase
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class GenericModel(pydantic.generics.GenericModel):
    class Config:
        alias_generator = camelcase
        allow_population_by_field_name = True

