package com.xeno.crm.customers;

public class Filter {
    private String field;
    private Operator operator;
    private String value;
    private Conjunction conjunction;

    public enum Operator {
        eq, gt, lt
    }

    public enum Conjunction {
        AND, OR
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public Operator getOperator() {
        return operator;
    }

    public void setOperator(Operator operator) {
        this.operator = operator;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Conjunction getConjunction() {
        return conjunction;
    }

    public void setConjunction(Conjunction conjunction) {
        this.conjunction = conjunction;
    }
}
