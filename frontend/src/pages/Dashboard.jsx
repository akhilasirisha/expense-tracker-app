import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const COLORS = [
    "#4F46E5",
    "#06B6D4",
    "#F59E0B",
    "#EF4444",
    "#10B981",
    "#8B5CF6",
  ];

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      setError("Please login first.");
      return;
    }

    fetch(`${API_BASE_URL}/expenses/user/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        return response.json();
      })
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        setError("Unable to load expenses.");
        setLoading(false);
      });
  }, [user?.id]);

  // TOTAL EXPENSE
  const totalExpenses = expenses.reduce(
    (total, expense) => total + (Number(expense.amount) || 0),
    0
  );

  // AVERAGE EXPENSE
  const averageExpense =
    expenses.length > 0 ? totalExpenses / expenses.length : 0;

  // CATEGORY-WISE TOTAL
  const categoryTotals = {};

  expenses.forEach((expense) => {
    const category = expense.category || "Other";
    const amount = Number(expense.amount) || 0;

    categoryTotals[category] =
      (categoryTotals[category] || 0) + amount;
  });

  const chartData = Object.keys(categoryTotals).map((category) => ({
    name: category,
    value: categoryTotals[category],
  }));

  // TOP CATEGORY
  let topCategory = "N/A";

  if (chartData.length > 0) {
    const highestCategory = chartData.reduce(
      (previous, current) =>
        current.value > previous.value ? current : previous
    );

    topCategory = highestCategory.name;
  }

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-700">
          Loading dashboard...
        </h2>
      </div>
    );
  }

  // LOGIN CHECK
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold text-red-600">
          Please login first.
        </h2>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold text-red-600">
          {error}
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* WELCOME */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome, {user.name} 👋
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Take control of your finances
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* TOTAL */}
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Total Expenses</p>

            <h2 className="text-3xl font-bold text-blue-600 mt-3">
              ₹{totalExpenses.toFixed(2)}
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              All your expenses
            </p>
          </div>

          {/* NUMBER */}
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Number of Expenses</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-3">
              {expenses.length}
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Total transactions
            </p>
          </div>

          {/* TOP CATEGORY */}
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Top Category</p>

            <h2 className="text-3xl font-bold text-purple-600 mt-3">
              {topCategory}
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Highest spending
            </p>
          </div>

          {/* AVERAGE */}
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Average Expense</p>

            <h2 className="text-3xl font-bold text-green-600 mt-3">
              ₹{averageExpense.toFixed(2)}
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Per transaction
            </p>
          </div>
        </div>

        {/* CHART + CATEGORY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* PIE CHART */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Spending by Category
            </h2>

            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-80">
                <div className="text-center">
                  <p className="text-lg text-gray-500">
                    No expenses added yet.
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    Add your first expense to see the chart.
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={55}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toFixed(2)}`
                    }
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* CATEGORY OVERVIEW */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Category Overview
            </h2>

            {chartData.length === 0 ? (
              <p className="text-gray-500 text-center py-20">
                No category data available.
              </p>
            ) : (
              <div className="space-y-4">
                {[...chartData]
                  .sort((a, b) => b.value - a.value)
                  .map((item, index) => {
                    const percentage =
                      totalExpenses > 0
                        ? (item.value / totalExpenses) * 100
                        : 0;

                    return (
                      <div
                        key={item.name}
                        className="border-b pb-4"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-gray-700">
                            {item.name}
                          </span>

                          <span className="font-semibold text-gray-800">
                            ₹{item.value.toFixed(2)}
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-3 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                COLORS[index % COLORS.length],
                            }}
                          />
                        </div>

                        <p className="text-sm text-gray-400 mt-1">
                          {percentage.toFixed(1)}% of total spending
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* RECENT EXPENSES */}
        <div className="mt-8 bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold text-gray-800">
              Recent Expenses
            </h2>

            <span className="text-gray-500">
              {expenses.length} records
            </span>
          </div>

          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No expenses found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 text-gray-600">Title</th>
                    <th className="py-4 text-gray-600">Category</th>
                    <th className="py-4 text-gray-600">Amount</th>
                    <th className="py-4 text-gray-600">Date</th>
                    <th className="py-4 text-gray-600">
                      Description
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-4 font-medium">
                        {expense.title}
                      </td>

                      <td className="py-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {expense.category}
                        </span>
                      </td>

                      <td className="py-4 font-semibold">
                        ₹{Number(expense.amount).toFixed(2)}
                      </td>

                      <td className="py-4 text-gray-600">
                        {expense.date}
                      </td>

                      <td className="py-4 text-gray-600">
                        {expense.description || "-"}
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

export default Dashboard;