<script setup>
import { ref, computed, watch, onMounted } from "vue";
import PlannerHeader from "./components/PlannerHeader.vue";
import BudgetForm from "./components/BudgetForm.vue";
import ExpenseAdmin from "./components/ExpenseAdmin.vue";
import ExpenseModal from "./components/ExpenseModal.vue";

const expense = ref(null);
const expenses = ref([]);
const budget = ref(null);
const modal = ref(false);
const filter = ref(null);

onMounted(() => {
  const finance = JSON.parse(window.localStorage.getItem("financeData"));

  if (!finance) return;

  budget.value = finance.budget;
  expenses.value = finance.expenses;
});

watch(expenses, () => {
  if (!expenses.value.length) return;

  // Save expenses with the budget in local storage
  const finance = JSON.stringify({
    ...JSON.parse(window.localStorage.getItem("financeData") || {}),
    expenses: expenses.value,
  });

  window.localStorage.setItem("financeData", finance);
});

const totalSpent = computed(() => {
  return expenses.value.reduce((acc, expense) => acc + expense.amount, 0);
});

const avaliableBudget = computed(() => {
  return budget.value - totalSpent.value;
});

const filterExpenses = computed(() => {
  if (!filter.value?.category) return expenses.value;

  return expenses.value.filter(
    (expense) => expense.category === filter.value.category
  );
});

const totalSpentByCategory = computed(() => {
  if (!filter.value?.category) return;

  return filterExpenses.value.reduce((acc, expense) => acc + expense.amount, 0);
});

const resetApp = () => {
  budget.value = null;
  expense.value = null;
  expenses.value = [];

  window.localStorage.removeItem("financeData");
};

const registerSpent = (expense) => {
  expenses.value = [...expenses.value, expense];
  modal.value = false;
};

const updateSpent = (expense) => {
  expenses.value = expenses.value.map((ex) =>
    ex.id !== expense.id ? ex : expense
  );

  modal.value = false;
  expense.value = null;
};

const removeSpent = (id) => {
  expenses.value = expenses.value.filter((expense) => expense.id !== id);
};

const choosenSpent = (id) => {
  const expenseChoosen = expenses.value.find((expense) => expense.id === id);

  if (!expenseChoosen)
    return console.error(new Error(`The expense with the id: ${id} not found`));

  modal.value = true;
  expense.value = expenseChoosen;
};

const filterCategory = (category) => {
  filter.value = category;
};

const toggleModal = () => {
  modal.value = !modal.value;

  // Clean expense when close modal
  expense && (expense.value = null);
};
</script>

<template>
  <PlannerHeader />

  <BudgetForm v-if="!budget" @set-budget="(value) => (budget = value)" />

  <template v-if="budget">
    <ExpenseAdmin
      @reset-app="resetApp"
      @choosen-spent="choosenSpent"
      @remove-spent="removeSpent"
      @filter-category="filterCategory"
      :budget="budget"
      :expenses="expenses"
      :totalSpent="totalSpent"
      :avaliableBudget="avaliableBudget"
      :filterExpenses="filterExpenses"
      :totalSpentByCategory="totalSpentByCategory"
    />

    <button
      @click="toggleModal"
      class="flex flex-col items-center justify-center fixed right-6 bottom-6 text-2xl rounded-full h-12 w-12 transition-all duration-500 ease-in-out bg-blue-900 text-white"
      :class="[modal ? 'rotate-45 bottom-[90vh] z-50' : '']"
    >
      <i class="bi bi-plus-lg" />
    </button>
  </template>

  <ExpenseModal
    v-if="modal"
    @update-spent="updateSpent"
    @register-spent="registerSpent"
    :expense="expense"
    :avaliableBudget="avaliableBudget"
  />
</template>
