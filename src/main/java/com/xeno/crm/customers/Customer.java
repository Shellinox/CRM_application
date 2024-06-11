package com.xeno.crm.customers;

import jakarta.persistence.*;
import org.hibernate.annotations.Formula;

import java.time.LocalDate;

@Entity
public class Customer {

    Customer(){}
    Customer(Long id){
        this.id=id;
    }
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    private String name;
    private Integer age;
    private String email;

    @Formula("(SELECT MAX(o.date) FROM customer_orders o WHERE o.customer_id = id)")
    private LocalDate lastOrderDate;

    @Formula("(SELECT COUNT(o.id) FROM customer_orders o WHERE o.customer_id = id)")
    private Long totalOrder;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getLastOrderDate() {
        return lastOrderDate;
    }

    public void setLastOrderDate(LocalDate lastOrderDate) {
        this.lastOrderDate = lastOrderDate;
    }

    public Long getTotalOrder() {
        return totalOrder;
    }

    public void setTotalOrder(Long totalOrder) {
        this.totalOrder = totalOrder;
    }
}

