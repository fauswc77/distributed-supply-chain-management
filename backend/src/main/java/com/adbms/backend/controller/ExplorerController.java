package com.adbms.backend.controller;

import com.adbms.backend.service.DistributedQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/explorer")
public class ExplorerController {

    @Autowired
    private DistributedQueryService distributedQueryService;

    @GetMapping("/{region}/tables")
    public ResponseEntity<List<String>> getTables(@PathVariable String region) {
        return ResponseEntity.ok(distributedQueryService.getTablesForRegion(region));
    }

    @GetMapping("/{region}/table/{tableName}")
    public ResponseEntity<List<Map<String, Object>>> getTableData(@PathVariable String region, @PathVariable String tableName) {
        return ResponseEntity.ok(distributedQueryService.getTableDataForRegion(region, tableName));
    }
}
