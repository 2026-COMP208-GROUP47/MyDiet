package com.mydiet.backend.repository;

import com.mydiet.backend.entity.DailyMeal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DailyMealRepository extends JpaRepository<DailyMeal, Long> {
    
    List<DailyMeal> findByPlanId(Long planId);
}