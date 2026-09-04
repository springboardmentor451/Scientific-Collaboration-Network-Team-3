"""add forms, responses, and conditional_rules tables

Revision ID: c3d8e1a90b12
Revises: 20aec71df882
Create Date: 2026-08-24 18:56:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c3d8e1a90b12"
down_revision: Union[str, Sequence[str], None] = "20aec71df882"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "forms",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_forms_id"), "forms", ["id"], unique=False)

    op.create_table(
        "responses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("form_id", sa.Integer(), nullable=False),
        sa.Column("answers", sa.JSON(), nullable=False),
        sa.ForeignKeyConstraint(["form_id"], ["forms.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_responses_id"), "responses", ["id"], unique=False)

    op.create_table(
        "conditional_rules",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("form_id", sa.Integer(), nullable=False),
        sa.Column("trigger_field", sa.String(length=255), nullable=False),
        sa.Column("operator", sa.String(length=50), nullable=False),
        sa.Column("comparison_value", sa.Text(), nullable=True),
        sa.Column("target_field", sa.String(length=255), nullable=False),
        sa.Column("action", sa.String(length=20), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_conditional_rules_id"), "conditional_rules", ["id"], unique=False)
    op.create_index(op.f("ix_conditional_rules_form_id"), "conditional_rules", ["form_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_conditional_rules_form_id"), table_name="conditional_rules")
    op.drop_index(op.f("ix_conditional_rules_id"), table_name="conditional_rules")
    op.drop_table("conditional_rules")
    op.drop_index(op.f("ix_responses_id"), table_name="responses")
    op.drop_table("responses")
    op.drop_index(op.f("ix_forms_id"), table_name="forms")
    op.drop_table("forms")
