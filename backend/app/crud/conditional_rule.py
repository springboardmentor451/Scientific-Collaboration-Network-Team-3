from sqlalchemy.orm import Session

from app.models.conditional_rule import ConditionalRule
from app.schemas.conditional_rule import (
    ConditionalRuleCreate,
    ConditionalRuleUpdate,
)


ALLOWED_OPERATORS = {
    "equals",
    "not_equals",
    "contains",
    "greater_than",
    "is_empty",
}

ALLOWED_ACTIONS = {
    "show",
    "hide",
    "require",
}


def create_rule(
    db: Session,
    form_id: int,
    rule: ConditionalRuleCreate,
):
    new_rule = ConditionalRule(
        form_id=form_id,
        trigger_field_id=rule.trigger_field_id,
        condition_operator=rule.condition_operator,
        comparison_value=rule.comparison_value,
        target_field_id=rule.target_field_id,
        action=rule.action,
    )

    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)

    return new_rule


def get_rules_by_form(
    db: Session,
    form_id: int,
):
    return (
        db.query(ConditionalRule)
        .filter(
            ConditionalRule.form_id == form_id
        )
        .all()
    )


def get_rule_by_id(
    db: Session,
    form_id: int,
    rule_id: int,
):
    return (
        db.query(ConditionalRule)
        .filter(
            ConditionalRule.id == rule_id,
            ConditionalRule.form_id == form_id,
        )
        .first()
    )


def update_rule(
    db: Session,
    form_id: int,
    rule_id: int,
    rule: ConditionalRuleUpdate,
):
    db_rule = get_rule_by_id(
        db,
        form_id,
        rule_id,
    )

    if not db_rule:
        return None

    update_data = rule.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            db_rule,
            field,
            value,
        )

    db.commit()
    db.refresh(db_rule)

    return db_rule


def delete_rule(
    db: Session,
    form_id: int,
    rule_id: int,
):
    db_rule = get_rule_by_id(
        db,
        form_id,
        rule_id,
    )

    if not db_rule:
        return None

    db.delete(db_rule)
    db.commit()

    return db_rule