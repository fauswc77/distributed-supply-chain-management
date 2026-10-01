package com.adbms.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean(name = "northDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.north")
    public DataSource northDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "northJdbcTemplate")
    public JdbcTemplate northJdbcTemplate() {
        return new JdbcTemplate(northDataSource());
    }

    @Bean(name = "westDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.west")
    public DataSource westDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "westJdbcTemplate")
    public JdbcTemplate westJdbcTemplate() {
        return new JdbcTemplate(westDataSource());
    }

    @Bean(name = "southDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.south")
    public DataSource southDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "southJdbcTemplate")
    public JdbcTemplate southJdbcTemplate() {
        return new JdbcTemplate(southDataSource());
    }

    @Primary
    @Bean(name = "centralizedDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.centralized")
    public DataSource centralizedDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "centralizedJdbcTemplate")
    public JdbcTemplate centralizedJdbcTemplate() {
        return new JdbcTemplate(centralizedDataSource());
    }
}
