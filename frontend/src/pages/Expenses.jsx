import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // LOAD EXPENSES
  // =========================

  const loadExpenses = async () => {
    if (!user || !user.id) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/expenses/user/${user.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load expenses");
      }

      const data = await response.json();
      setExpenses(data);

    } catch (error) {
      console.error("Error loading expenses:", error);
      alert("Unable to load expenses!");
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // =========================
  // ADD / UPDATE EXPENSE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("Please login first!");
      return;
    }

    if (
      !title.trim() ||
      !category ||
      !amount ||
      !paymentMethod ||
      !date
    ) {
      alert("Please fill all required fields!");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Amount must be greater than 0!");
      return;
    }

    setLoading(true);

    try {
      // =========================
      // UPDATE EXPENSE
      // =========================

      if (editingId) {
        const response = await fetch(
          `${API_BASE_URL}/expenses/${editingId}?userId=${user.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              title: title.trim(),
              amount: Number(amount),
              category: category,
              paymentMethod: paymentMethod,
              description: description.trim(),
              date: date,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update expense");
        }

        alert("Expense updated successfully!");
      }

      // =========================
      // ADD EXPENSE
      // =========================

      else {
        const response = await fetch(
          `${API_BASE_URL}/expenses?userId=${user.id}`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              title: title.trim(),
              amount: Number(amount),
              category: category,
              paymentMethod: paymentMethod,
              description: description.trim(),
              date: date,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add expense");
        }

        alert("Expense added successfully!");
      }

      clearForm();

      await loadExpenses();

    } catch (error) {
      console.error("Error:", error);

      alert(
        editingId
          ? "Unable to update expense!"
          : "Unable to add expense!"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT EXPENSE
  // =========================

  const handleEdit = (expense) => {
    setEditingId(expense.id);

    setTitle(expense.title || "");
    setCategory(expense.category || "");
    setAmount(expense.amount || "");
    setPaymentMethod(expense.paymentMethod || "");
    setDescription(expense.description || "");
    setDate(expense.date || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE EXPENSE
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) {
      return;
    }

    if (!user || !user.id) {
      alert("Please login first!");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/expenses/${id}?userId=${user.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      alert("Expense deleted successfully!");

      await loadExpenses();

    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Unable to delete expense!");
    }
  };

  // =========================
  // CLEAR FORM
  // =========================

  const clearForm = () => {
    setTitle("");
    setCategory("");
    setAmount("");
    setPaymentMethod("");
    setDescription("");
    setDate("");

    setEditingId(null);
  };

  // =========================
  // TOTAL EXPENSES
  // =========================

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADING */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Your Expenses 💰
          </h1>

          <p className="text-gray-500 mt-2">
            Add and manage your daily expenses
          </p>

        </div>

        {/* ADD / EDIT FORM */}

        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">

            {editingId
              ? "Edit Expense ✏️"
              : "Add Expense"}

          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* TITLE */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Example: Breakfast"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >

                <option value="">
                  Select Category
                </option>

                <option value="Food">
                  Food
                </option>

                <option value="Transportation">
                  Transportation
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="Shopping">
                  Shopping
                </option>

                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Bills">
                  Bills
                </option>

                <option value="Health">
                  Health
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            {/* AMOUNT */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="Example: 500"
                min="0.01"
                step="0.01"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* PAYMENT METHOD */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >

                <option value="">
                  Select Payment Method
                </option>

                <option value="Cash">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Debit Card">
                  Debit Card
                </option>

                <option value="Credit Card">
                  Credit Card
                </option>

                <option value="Net Banking">
                  Net Banking
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            {/* DATE */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="What did you spend this money on?"
                rows="4"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* BUTTONS */}

            <div className="md:col-span-2 flex gap-3">

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-xl transition"
              >

                {loading
                  ? "Saving..."
                  : editingId
                  ? "✏️ Update Expense"
                  : "➕ Add Expense"}

              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-xl transition"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* TOTAL */}

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow p-6 mb-6">

          <p className="text-lg">
            Total Expenses
          </p>

          <h2 className="text-4xl font-bold mt-2">
            ₹{totalExpenses.toFixed(2)}
          </h2>

          <p className="mt-2">
            {expenses.length} expenses
          </p>

        </div>

        {/* EXPENSE TABLE */}

        <div className="bg-white rounded-2xl shadow p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-semibold text-gray-800">
              Your Expenses
            </h2>

            <span className="text-gray-500">
              {expenses.length} records
            </span>

          </div>

          {expenses.length === 0 ? (

            <div className="text-center py-12">

              <p className="text-lg text-gray-500">
                No expenses added yet.
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Add your first expense above.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>

                  <tr className="border-b">

                    <th className="py-3">
                      Title
                    </th>

                    <th className="py-3">
                      Category
                    </th>

                    <th className="py-3">
                      Amount
                    </th>

                    <th className="py-3">
                      Payment Method
                    </th>

                    <th className="py-3">
                      Date
                    </th>

                    <th className="py-3">
                      Description
                    </th>

                    <th className="py-3">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {expenses.map((expense) => (

                    <tr
                      key={expense.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="py-4">
                        {expense.title}
                      </td>

                      <td className="py-4">

                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                          {expense.category}
                        </span>

                      </td>

                      <td className="py-4 font-semibold">
                        ₹{Number(expense.amount).toFixed(2)}
                      </td>

                      <td className="py-4">

                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                          {expense.paymentMethod || "-"}
                        </span>

                      </td>

                      <td className="py-4">
                        {expense.date}
                      </td>

                      <td className="py-4">
                        {expense.description || "-"}
                      </td>

                      <td className="py-4">

                        <div className="flex gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(expense)
                            }
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(expense.id)
                            }
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Expenses;