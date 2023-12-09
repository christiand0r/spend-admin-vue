<script setup>
import { CircleProgressBar } from "circle-progress.vue";
import ExpenseList from "./ExpenseList.vue";
import ExpenseFilter from "./ExpenseFilter.vue";
import { parseNumberToCurrency, calculateCurrentPercentage } from "../helpers";

const emit = defineEmits([
  "reset-app",
  "choosen-spent",
  "remove-spent",
  "filter-category",
]);

const props = defineProps({
  budget: Number,
  expenses: Array,
  totalSpent: Number,
  avaliableBudget: Number,
  filterExpenses: Array,
  totalSpentByCategory: [Number, null],
});
</script>

<template>
  <div class="px-6 bg-linear-app">
    <div
      class="flex flex-col items-center justify-between gap-4 mx-auto px-12 py-8 rounded-lg shadow-md max-w-2xl w-full bg-white sm:flex-row"
    >
      <div class="flex items-center justify-center flex-1">
        <CircleProgressBar
          :value="totalSpent"
          :max="budget"
          size="180"
          strokeWidth="10px"
          colorUnfilled="#3B82F6"
        >
          <span class="font-medium">
            {{ calculateCurrentPercentage(budget, totalSpent) }}%
          </span>
        </CircleProgressBar>
      </div>

      <div class="flex flex-col w-full sm:w-1/2">
        <button
          @click="() => emit('reset-app')"
          class="font-bold text-sm mb-4 px-4 py-2 uppercase rounded-lg bg-red-800 text-white"
        >
          Restablecer Presupuesto
        </button>
        <p class="flex justify-between text-xl gap-2">
          <span class="font-bold text-blue-500">Presupuesto:</span>
          <span class="font-semibold text-gray-400">
            {{ parseNumberToCurrency(props.budget) }}
          </span>
        </p>
        <p class="flex justify-between text-xl gap-2">
          <span class="font-bold text-blue-500">Disponible:</span>
          <span class="font-semibold text-gray-400">
            {{ parseNumberToCurrency(props.avaliableBudget) }}
          </span>
        </p>
        <p class="flex justify-between text-xl gap-2">
          <span class="font-bold text-blue-500">Gastado:</span>
          <span class="font-semibold text-gray-400">
            {{ parseNumberToCurrency(props.totalSpent) }}
          </span>
        </p>
      </div>
    </div>
  </div>

  <div class="px-6">
    <div
      class="mt-8 mx-auto w-full"
      :class="[expenses.length ? 'max-w-2xl' : 'max-w-lg']"
    >
      <template v-if="expenses.length">
        <ExpenseFilter
          @filter-category="(category) => emit('filter-category', category)"
        />

        <ExpenseList
          @choosen-spent="(id) => emit('choosen-spent', id)"
          @remove-spent="(id) => emit('remove-spent', id)"
          :expenses="props.filterExpenses"
        />
      </template>

      <h3 v-else class="text-center">
        No se agregado gastos aún.
        <span class="font-medium text-blue-500">Comienza agregando uno</span>
      </h3>

      <p
        v-if="totalSpentByCategory"
        class="text-sm text-end py-4 text-gray-600"
      >
        Total gastado en categoría seleccionada:
        {{ parseNumberToCurrency(totalSpentByCategory) }}
      </p>
    </div>
  </div>
</template>
