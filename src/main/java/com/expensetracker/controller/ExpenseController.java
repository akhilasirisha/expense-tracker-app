package com.expensetracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.model.Expense;
import com.expensetracker.service.ExpenseService;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://expense-tracker-frontend-9pbz3l72n-akhila24.vercel.app",
    "https://expense-tracker-frontend-one-gamma.vercel.app",
    "https://expenseai-finance.vercel.app"
})
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // =========================
    // ADD EXPENSE
    // =========================

    @PostMapping("/expenses")
    public Expense addExpense(
            @RequestBody Expense expense,
            @RequestParam Long userId) {

        return expenseService.addExpense(expense, userId);
    }

    // =========================
    // GET EXPENSES BY USER
    // =========================

    @GetMapping("/expenses/user/{userId}")
    public List<Expense> getExpensesByUserId(
            @PathVariable Long userId) {

        return expenseService.getExpensesByUserId(userId);
    }

    // =========================
    // GET SINGLE EXPENSE
    // =========================

    @GetMapping("/expenses/{id}")
    public Expense getExpenseById(
            @PathVariable Long id,
            @RequestParam Long userId) {

        return expenseService.getExpenseById(id, userId);
    }

    // =========================
    // UPDATE EXPENSE
    // =========================

    @PutMapping("/expenses/{id}")
    public Expense updateExpense(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestBody Expense expense) {

        return expenseService.updateExpense(id, expense, userId);
    }

    // =========================
    // DELETE EXPENSE
    // =========================

    @DeleteMapping("/expenses/{id}")
    public String deleteExpense(
            @PathVariable Long id,
            @RequestParam Long userId) {

        boolean deleted = expenseService.deleteExpense(id, userId);

        if (deleted) {
            return "Expense deleted successfully";
        }

        return "You are not allowed to delete this expense";
    }
}