package com.xeno.crm.customers;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EntityManager entityManager;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> searchCustomer(List<Filter> filter) {
        StringBuilder condition = new StringBuilder("1=1");
        StringBuilder having = new StringBuilder("1=1");
        for (Filter f : filter) {
            String operator = switch (f.getOperator()) {
                case eq -> "=";
                case gt -> ">";
                case lt -> "<";
            };
            if (f.getField().equals("age")) {
                condition
                        .append(" ")
                        .append(f.getConjunction())
                        .append(" ")
                        .append(f.getField())
                        .append(" ")
                        .append(operator)
                        .append(" ")
                        .append(f.getValue());
            } else {
                having
                        .append(" ")
                        .append(f.getConjunction())
                        .append(" ")
                        .append(f.getField())
                        .append(" ")
                        .append(operator)
                        .append(" ")
                        .append("'")
                        .append(f.getValue())
                        .append("'");
            }
        }
        Query query = entityManager.createNativeQuery(
                "select DISTINCT c.id from customer c JOIN customer_orders o ON c.id = o.customer_id WHERE "
                        + condition +
                        " GROUP BY o.customer_id HAVING "
                        + having
        );
        //noinspection unchecked
        return customerRepository.findAllById(query.getResultList());
    }
}
