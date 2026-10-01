package com.adbms.backend.controller;

import com.adbms.backend.service.DistributedQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/fragmentation")
public class FragmentationController {

    @Autowired
    private DistributedQueryService distributedQueryService;

    @GetMapping("/phf")
    public ResponseEntity<Map<String, Object>> getPHF() {
        return ResponseEntity.ok(distributedQueryService.getPrimaryHorizontalFragmentation());
    }

    @GetMapping("/dhf")
    public ResponseEntity<Map<String, Object>> getDHF() {
        return ResponseEntity.ok(distributedQueryService.getDerivedHorizontalFragmentation());
    }

    @GetMapping("/vf")
    public ResponseEntity<Map<String, Object>> getVF() {
        return ResponseEntity.ok(distributedQueryService.getVerticalFragmentation());
    }
    
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(distributedQueryService.comparePerformance());
    }
}
