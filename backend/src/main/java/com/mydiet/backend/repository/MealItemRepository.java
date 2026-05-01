package com.mydiet.backend.repository;

import com.mydiet.backend.entity.MealItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MealItemRepository extends JpaRepository<MealItem, Long> {
    
    List<MealItem> findByDailyMealId(Long dailyMealId);
}