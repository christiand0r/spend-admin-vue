<script setup>
import { ref } from "vue";

const emit = defineEmits(["set-budget"]);

const error = ref(null);
const budgetErrorMap = {
  nozero: "El presupuesto debe ser mayor a cero.",
  nonegative: "El prespuesto debe ser positivo.",
};

const handleBudget = (e) => {
  const { budget } = Object.fromEntries(new FormData(e.target));
  const value = Number(budget);

  if (value < 0) return (error.value = budgetErrorMap.nonegative);

  if (value === 0) return (error.value = budgetErrorMap.nozero);

  error.value = null;

  // Save the budget in local storage
  const finance = JSON.stringify({ budget: value });
  window.localStorage.setItem("financeData", finance);

  emit("set-budget", value);
};

const parsedBudget = (e) => {
  const { valueAsNumber } = e.target;
  e.target.value = valueAsNumber > 0 ? valueAsNumber : 0;
};
</script>

<template>
  <div class="px-6 bg-linear-app">
    <form
      @submit.prevent="handleBudget"
      class="mx-auto px-12 py-8 rounded-lg shadow-md max-w-4xl w-full bg-white"
    >
      <div class="flex flex-col">
        <label
          for="budget"
          class="font-medium text-2xl text-center mb-6 text-blue-500"
          >Definir Presupuesto</label
        >
        <input
          type="number"
          id="budget"
          name="budget"
          value="0"
          @input="parsedBudget"
          :class="[error ? 'border-red-400' : 'border-gray-100']"
          class="text-2xl text-center px-4 py-2 rounded-lg border outline-none bg-gray-100"
        />
        <span v-if="error" class="text-sm text-center text-red-400">{{
          error
        }}</span>
      </div>

      <button
        type="submit"
        class="font-medium text-xl mt-6 px-6 py-2 rounded-lg w-full bg-blue-500 text-white"
      >
        Iniciar
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
