package com.mydiet.backend.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "meal_items")
public class MealItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "daily_meal_id", nullable = false)
    private Long dailyMealId;

    @Column(name = "meal_type")
    private String mealType;

    @Column(name = "is_main")
    private Boolean isMain;

    @Column(name = "recipe_id", nullable = false)
    private Integer recipeId;
}