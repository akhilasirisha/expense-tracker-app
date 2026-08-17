package com.expensetracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }


    // =========================
    // ADD EXPENSE
    // =========================

    public Expense addExpense(Expense expense, Long userId) {

        User user = userRepository
                .findById(userId)
                .orElse(null);

        if (user == null) {
            return null;
        }

        // Attach expense to logged-in user
        expense.setUser(user);

        return expenseRepository.save(expense);
    }


    // =========================
    // GET EXPENSES BY USER
    // =========================

    public List<Expense> getExpensesByUserId(Long userId) {

        return expenseRepository.findByUserId(userId);
    }


    // =========================
    // GET SINGLE EXPENSE
    // =========================

    public Expense getExpenseById(Long id, Long userId) {

        Expense expense = expenseRepository
                .findById(id)
                .orElse(null);

        if (expense == null) {
            return null;
        }

        // Check ownership
        if (expense.getUser() == null ||
            !expense.getUser().getId().equals(userId)) {

            return null;
        }

        return expense;
    }


    // =========================
    // UPDATE EXPENSE
    // =========================

    public Expense updateExpense(
            Long id,
            Expense expense,
            Long userId) {

        Expense existingExpense = expenseRepository
                .findById(id)
                .orElse(null);

        if (existingExpense == null) {
            return null;
        }

        // IMPORTANT:
        // Check whether this expense belongs
        // to the logged-in user.

        if (existingExpense.getUser() == null ||
            !existingExpense.getUser().getId().equals(userId)) {

            return null;
        }

        // Update only expense details
        existingExpense.setTitle(expense.getTitle());
        existingExpense.setAmount(expense.getAmount());
        existingExpense.setCategory(expense.getCategory());
        existingExpense.setDescription(expense.getDescription());
        existingExpense.setDate(expense.getDate());

        // Keep original user
        existingExpense.setUser(existingExpense.getUser());

        return expenseRepository.save(existingExpense);
    }


    // =========================
    // DELETE EXPENSE
    // =========================

    public boolean deleteExpense(
            Long id,
            Long userId) {

        Expense existingExpense = expenseRepository
                .findById(id)
                .orElse(null);

        if (existingExpense == null) {
            return false;
        }

        // IMPORTANT:
        // Only the owner can delete the expense.

        if (existingExpense.getUser() == null ||
            !existingExpense.getUser().getId().equals(userId)) {

            return false;
        }

        expenseRepository.delete(existingExpense);

        return true;
    }
}