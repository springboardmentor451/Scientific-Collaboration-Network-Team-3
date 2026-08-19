from typing import Any

from sqlalchemy.orm import Session

from app.models.conditional_rule import ConditionalRule


# ============================================================
# CREATE CONDITIONAL RULE
# ============================================================

def create_rule(
    db: Session,
    form_id: int,
    rule,
):
    new_rule = ConditionalRule(
        form_id=form_id,
        trigger_field=rule.trigger_field,
        operator=rule.operator,
        comparison_value=rule.comparison_value,
        target_field=rule.target_field,
        action=rule.action,
    )

    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)

    return new_rule


# ============================================================
# GET ALL CONDITIONAL RULES FOR A FORM
# ============================================================

def get_rules(
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


# ============================================================
# DELETE CONDITIONAL RULE
# ============================================================

def delete_rule(
    db: Session,
    rule_id: int,
):
    rule = (
        db.query(ConditionalRule)
        .filter(
            ConditionalRule.id == rule_id
        )
        .first()
    )

    if not rule:
        return None

    db.delete(rule)
    db.commit()

    return rule


# ============================================================
# COMPARE A VALUE AGAINST A RULE
# ============================================================

def evaluate_condition(
    actual_value: Any,
    operator: str,
    comparison_value: Any = None,
) -> bool:

    # --------------------------------------------------------
    # equals
    # --------------------------------------------------------

    if operator == "equals":
        return str(actual_value).strip().lower() == str(
            comparison_value
        ).strip().lower()

    # --------------------------------------------------------
    # not_equals
    # --------------------------------------------------------

    if operator == "not_equals":
        return str(actual_value).strip().lower() != str(
            comparison_value
        ).strip().lower()

    # --------------------------------------------------------
    # contains
    # --------------------------------------------------------

    if operator == "contains":
        return str(comparison_value).strip().lower() in str(
            actual_value
        ).strip().lower()

    # --------------------------------------------------------
    # greater_than
    # --------------------------------------------------------

    if operator == "greater_than":
        try:
            return float(actual_value) > float(
                comparison_value
            )
        except (TypeError, ValueError):
            return False

    # --------------------------------------------------------
    # is_empty
    # --------------------------------------------------------

    if operator == "is_empty":

        if actual_value is None:
            return True

        if isinstance(actual_value, str):
            return actual_value.strip() == ""

        if isinstance(actual_value, list):
            return len(actual_value) == 0

        return False

    # --------------------------------------------------------
    # Unsupported operator
    # --------------------------------------------------------

    return False


# ============================================================
# EVALUATE A SINGLE RULE
# ============================================================

def evaluate_rule(
    rule: ConditionalRule,
    answers: dict,
) -> dict:

    actual_value = answers.get(
        rule.trigger_field
    )

    condition_result = evaluate_condition(
        actual_value=actual_value,
        operator=rule.operator,
        comparison_value=rule.comparison_value,
    )

    return {
        "rule_id": rule.id,
        "trigger_field": rule.trigger_field,
        "target_field": rule.target_field,
        "operator": rule.operator,
        "condition_met": condition_result,
        "action": rule.action,
    }


# ============================================================
# EVALUATE ALL RULES FOR A FORM
# ============================================================

def evaluate_form_rules(
    db: Session,
    form_id: int,
    answers: dict,
) -> dict:

    rules = (
        db.query(ConditionalRule)
        .filter(
            ConditionalRule.form_id == form_id
        )
        .all()
    )

    field_states = {}

    evaluated_rules = []

    for rule in rules:

        result = evaluate_rule(
            rule=rule,
            answers=answers,
        )

        evaluated_rules.append(result)

        target_field = rule.target_field

        if target_field not in field_states:
            field_states[target_field] = {
                "visible": True,
                "required": False,
            }

        # ----------------------------------------------------
        # Apply action only when condition is TRUE
        # ----------------------------------------------------

        if result["condition_met"]:

            if rule.action == "show":

                field_states[target_field][
                    "visible"
                ] = True

            elif rule.action == "hide":

                field_states[target_field][
                    "visible"
                ] = False

            elif rule.action == "require":

                field_states[target_field][
                    "required"
                ] = True

    return {
        "form_id": form_id,
        "fields": field_states,
        "rules": evaluated_rules,
    }