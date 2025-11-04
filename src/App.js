import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [theme, setTheme] = useState("light");
  const [filter, setFilter] = useState("Todas");
  const [toast, setToast] = useState(null); // mensagem de feedback

  // carregar dados do LocalStorage
  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(savedExpenses);

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  // salvar gastos e tema
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  // função de exibir toast
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // adicionar gasto
  const addExpense = (e) => {
    e.preventDefault();
    if (!description || !amount || !category) return;
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category: category.trim(),
    };
    setExpenses([...expenses, newExpense]);
    setDescription("");
    setAmount("");
    setCategory("");
    showToast("💸 Gasto adicionado com sucesso!", "success");
  };

  // remover gasto
  const removeExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    showToast("❌ Gasto removido", "error");
  };

  // calcular total filtrado
  const total = expenses
    .filter((exp) => filter === "Todas" || exp.category === filter)
    .reduce((acc, curr) => acc + curr.amount, 0);

  // alternar tema
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // gerar lista de categorias únicas
  const categories = [...new Set(expenses.map((exp) => exp.category.trim()))].sort();

  // aplicar filtro
  const filteredExpenses =
    filter === "Todas" ? expenses : expenses.filter((exp) => exp.category === filter);

  return (
    <div className={`app ${theme}`}>
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="header">
        <h1>💰 Controle de Gastos</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Modo Escuro" : "☀️ Modo Claro"}
        </button>
      </div>

      {/* Formulário */}
      <form onSubmit={addExpense}>
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor (R$)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Categoria (ex: Alimentação, Salário...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit" className="add-btn">Adicionar</button>
      </form>

      {/* Filtro */}
      <div className="filter">
        <label>Filtrar por categoria: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="Todas">Todas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de gastos */}
      <ul>
        {filteredExpenses.map((exp) => (
          <li key={exp.id}>
            <div className="expense-info">
              <strong>{exp.description}</strong>
              <small>{exp.category}</small>
            </div>
            <div className="expense-right">
              <span>R$ {exp.amount.toFixed(2)}</span>
              <button onClick={() => removeExpense(exp.id)}>✖</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Total */}
      <h2>
        Total: <span>R$ {total.toFixed(2)}</span>
      </h2>
    </div>
  );
}

export default App;
