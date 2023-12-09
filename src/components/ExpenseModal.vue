<script setup>
import { ref } from "vue";
import { generateID } from "../helpers";
import { SPENDING_CATEGORIES as categories } from "../helpers/const";

const emit = defineEmits(["register-spent", "update-spent"]);

const { expense, avaliableBudget } = defineProps({
  expense: Object,
  avaliableBudget: Number,
});

const errors = ref(null);
const spentValidationMap = {
  category: [
    {
      message: "Debe seleccionar una categoría",
      validation: (value) => !value,
    },
  ],
  concept: [
    {
      message: "Debe indicar un concepto válido.",
      validation: (value) => !value,
    },
  ],
  amount: [
    {
      message: "El monto debe ser un número positivo.",
      validation: (value) => Number(value) < 0,
    },
    {
      message: "El monto debe ser un número mayor que 0.",
      validation: (value) => !value,
    },
    {
      message: "El monto excede el presupuesto establecido",
      validation: (value, expense) => {
        return expense
          ? value > expense.amount + avaliableBudget
          : value > avaliableBudget;
      },
    },
  ],
};

const registerSpent = (e) => {
  const spent = Object.fromEntries(new FormData(e.target));

  // Create an error object by running all
  // validations for each of the existing keys
  const validationErrors = Object.entries(spent).reduce((acc, [key, value]) => {
    spentValidationMap[key].forEach((method) => {
      acc[key] = method.validation(value, expense) ? method.message : acc[key];
    });

    // If the error does not exist, delete the object
    !acc[key] && delete acc[key];

    return acc;
  }, {});

  errors.value = Object.keys(validationErrors).length ? validationErrors : null;
  if (errors.value) return;

  // Clear form
  e.target.reset();

  expense
    ? emit("update-spent", {
        ...expense,
        ...spent,
        modified: Date.now(),
        amount: Number(spent.amount),
      })
    : emit("register-spent", {
        ...spent,
        id: generateID(),
        timestamp: Date.now(),
        amount: Number(spent.amount),
      });
};
</script>

<template>
  <dialog
    class="flex items-center justify-center fixed top-0 left-0 h-full w-full bg-opacity-90 bg-black"
  >
    <form
      @submit.prevent="registerSpent"
      class="flex flex-col gap-4 px-6 max-w-sm w-full"
    >
      <legend
        class="font-semibold text-4xl text-center mb-4 pb-2 border-b-2 uppercase border-white text-white"
      >
        Registrar Gasto
      </legend>

      <div class="flex flex-col gap-2">
        <label class="font-bold text-xs uppercase text-white">Concepto</label>
        <input
          type="text"
          id="concept"
          name="concept"
          :value="expense?.concept || ''"
          autocomplete="new-password"
          placeholder="Ingrese el concepto del gasto"
          class="px-2 py-1 border outline-none rounded-md w-full"
          :class="[errors?.concept ? 'border-red-400' : '']"
        />
        <span v-if="errors?.concept" class="text-xs text-red-400">
          {{ errors.concept }}
        </span>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold text-xs uppercase text-white">Monto</label>
        <input
          type="number"
          id="amount"
          name="amount"
          :value="expense?.amount || ''"
          autocomplete="new-password"
          placeholder="Ingrese el monto del gasto"
          class="px-2 py-1 border outline-none rounded-md w-full"
          :class="[errors?.amount ? 'border-red-400' : '']"
        />
        <span v-if="errors?.amount" class="text-xs text-red-400">
          {{ errors.amount }}
        </span>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold text-xs uppercase text-white">Categoría</label>
        <select
          id="category"
          name="category"
          :value="expense?.category || ''"
          class="px-2 py-1 border outline-none rounded-md w-full"
          :class="[errors?.category ? 'border-red-400' : '']"
        >
          <option value="" hidden selected>Seleccione una categoría</option>
          <option
            v-for="category of categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <span v-if="errors?.category" class="text-xs text-red-400">
          {{ errors.category }}
        </span>
      </div>

      <button
        type="submit"
        class="font-bold py-2 px-4 uppercase rounded-md w-full bg-blue-500 text-white"
      >
        {{ expense ? "Actualizar" : "Registrar" }}
      </button>
    </form>
  </dialog>
</template>

<style lang="scss" scoped></style>
