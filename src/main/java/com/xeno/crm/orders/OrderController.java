package com.xeno.crm.orders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem i : order.getOrderItems()) {
            BigDecimal multiply = i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity()));
            total = total.add(multiply);
        }
        order.setTotalAmount(total);
        return orderService.saveOrder(order);
    }

    @GetMapping
    public List<Order> getaOrders() {
        return orderService.getAllOrders();
    }
}
