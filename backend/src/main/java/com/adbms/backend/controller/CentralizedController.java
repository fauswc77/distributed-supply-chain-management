package com.adbms.backend.controller;

import com.adbms.backend.service.DistributedQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/centralized")
public class CentralizedController {

    @Autowired
    private DistributedQueryService distributedQueryService;

    @GetMapping("/suppliers")
    public ResponseEntity<List<Map<String, Object>>> getSuppliers() {
        return ResponseEntity.ok(distributedQueryService.getSuppliersCentralized());
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<Map<String, Object>>> getInventory() {
        return ResponseEntity.ok(distributedQueryService.getInventoryCentralized());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Map<String, Object>>> getOrders() {
        return ResponseEntity.ok(distributedQueryService.getOrdersCentralized());
    }
}
