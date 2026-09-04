from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.database import DATABASE_URL, Base
from app.models.citation import Citation  # noqa: F401
from app.models.collaboration import Collaboration  # noqa: F401
from app.models.conditional_rule import ConditionalRule  # noqa: F401
from app.models.conference import Conference  # noqa: F401
from app.models.form import Form  # noqa: F401
from app.models.institution import Institution  # noqa: F401
from app.models.otp import OTPVerification  # noqa: F401
from app.models.publication import Publication  # noqa: F401
from app.models.publication_author import PublicationAuthor  # noqa: F401
from app.models.researcher import Researcher  # noqa: F401
from app.models.response import Response  # noqa: F401
from app.models.user import User  # noqa: F401

config = context.config

if DATABASE_URL:
    config.set_main_option("sqlalchemy.url", DATABASE_URL.replace("%", "%%"))

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def include_object(object_, name, type_, reflected, compare_to):
    # Keep tables created by earlier revisions (institutions, publications, ...)
    # even though those ORM models are not loaded on Day 1.
    if type_ == "table" and reflected and compare_to is None:
        return False
    return True


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        include_object=include_object,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            include_object=include_object,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
