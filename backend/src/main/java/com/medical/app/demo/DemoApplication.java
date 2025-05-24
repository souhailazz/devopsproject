package com.medical.app.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.medical.app.controller", 
                              "com.medical.app.service", 
                              "com.medical.app.dao", 
                              "com.medical.app.model", 
                              "com.medical.app.repository", 
                              "com.medical.app.demo"})
@EntityScan(basePackages = {"com.medical.app.model"})
@EnableJpaRepositories(basePackages = {"com.medical.app.repository"})
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}