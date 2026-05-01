package com.mydiet.backend.repository;
import com.mydiet.backend.entity.MealPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    Optional<MealPlan> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}