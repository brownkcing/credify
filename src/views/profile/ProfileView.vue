<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header with Buttons -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
        <div class="space-x-4">
          <button
            @click="isEditing = !isEditing"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {{ isEditing ? "Cancel" : "Edit Profile" }}
          </button>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-if="user" class="bg-white shadow rounded-lg">
        <!-- User Profile Section -->
        <div class="p-8 bg-white rounded-lg shadow">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-xl font-semibold text-gray-900">
              Basic Information
            </h2>
            <button
              @click="isEditing = !isEditing"
              class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md"
              :class="
                isEditing
                  ? 'text-gray-700 bg-gray-100'
                  : 'text-blue-600 hover:text-blue-700'
              "
            >
              {{ isEditing ? "Cancel" : "Edit" }}
              <svg
                v-if="!isEditing"
                class="ml-2 h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-8 8a2 2 0 01-.586.586l-4 1a1 1 0 01-1.217-1.217l1-4a2 2 0 01.586-.586l8-8z"
                />
              </svg>
            </button>
          </div>

          <div class="mb-8 flex items-center space-x-6">
            <ProfilePicture
              :user-name="user.name"
              :image-url="user.profilePicture"
              @update="handleProfilePictureUpdate"
            />
            <div>
              <h2 class="text-xl font-semibold text-gray-900">
                {{ user.name }}
              </h2>
              <div class="mt-1 flex items-center space-x-2">
                <span class="text-sm text-gray-500">{{ user.email }}</span>
                <span
                  v-if="user.isVerified"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                >
                  <svg
                    class="mr-1 h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Verified
                </span>
              </div>
              <div
                class="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                Account Status: Active
              </div>
            </div>
          </div>

          <!-- View Mode -->
          <div v-if="!isEditing" class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="text-sm font-medium text-gray-500">Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ user.name }}</p>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-500">Email</label>
                <p class="mt-1 text-sm text-gray-900">{{ user.email }}</p>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-500"
                  >Language</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ user.preferredLanguage === "en" ? "English" : "日本語" }}
                </p>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-500"
                  >Phone Number</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ user.phoneNumber || "—" }}
                </p>
              </div>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Name</label
                >
                <input
                  v-model="editForm.name"
                  type="text"
                  @blur="validateField('name')"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.name }"
                />
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">
                  {{ errors.name }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Phone Number</label
                >
                <input
                  v-model="editForm.phoneNumber"
                  type="tel"
                  @blur="validateField('phoneNumber')"
                  placeholder="+81 90-1234-5678"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.phoneNumber }"
                />
                <p v-if="errors.phoneNumber" class="mt-1 text-sm text-red-600">
                  {{ errors.phoneNumber }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Language</label
                >
                <select
                  v-model="editForm.preferredLanguage"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                @click="handleSave"
                :disabled="isSaving || hasErrors || !isFormValid"
                class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ isSaving ? "Saving..." : "Save Changes" }}
              </button>
            </div>
          </div>

          <!-- Account Activity -->
          <div class="mt-6 border-t pt-4">
            <h3 class="text-sm font-medium text-gray-500">Recent Activity</h3>
            <div class="mt-2 space-y-2">
              <div
                v-for="(activity, index) in recentActivity"
                :key="index"
                class="text-sm"
              >
                <span class="text-gray-600">{{ activity.date }}</span>
                <span class="mx-2">·</span>
                <span>{{ activity.action }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Settings Section -->
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            Payment Settings
          </h2>

          <!-- Balance Display -->
          <div class="mb-6 bg-white rounded-lg shadow">
            <div class="p-6 flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Available Balance</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatCurrency(user.paymentSettings?.balance || 0) }}
                </p>
              </div>
              <button
                @click="router.push('/transactions')"
                class="flex items-center text-blue-600 hover:text-blue-700"
              >
                <span class="mr-2">View Transactions</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Default Payment Method -->
          <div class="mb-6">
            <label class="text-sm font-medium text-gray-500"
              >Default Payment Method</label
            >
            <div class="mt-2 grid grid-cols-3 gap-3">
              <button
                v-for="method in paymentMethods"
                :key="method.value"
                @click="updateDefaultMethod(method.value)"
                :class="[
                  'px-4 py-3 border rounded-lg text-sm font-medium',
                  user.paymentSettings.defaultMethod === method.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                ]"
              >
                {{ method.label }}
              </button>
            </div>
          </div>

          <!-- Transaction Limit -->
          <div class="mb-6">
            <label class="text-sm font-medium text-gray-500"
              >Daily Transaction Limit</label
            >
            <select
              v-model="user.paymentSettings.transactionLimit"
              class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="50000">¥50,000</option>
              <option value="100000">¥100,000</option>
              <option value="200000">¥200,000</option>
              <option value="500000">¥500,000</option>
            </select>
          </div>

          <!-- Linked Accounts -->
          <div class="space-y-4">
            <!-- Bank Account -->
            <div
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 class="font-medium text-gray-900">Bank Account</h3>
                <p class="text-sm text-gray-500">
                  {{
                    user.paymentSettings.bankAccount?.isLinked
                      ? `${user.paymentSettings.bankAccount.bankName} ****${user.paymentSettings.bankAccount.lastFourDigits}`
                      : "No bank account linked"
                  }}
                </p>
              </div>
              <button
                class="text-blue-600 hover:text-blue-700"
                @click="handleLinkBank"
              >
                {{
                  user.paymentSettings.bankAccount?.isLinked ? "Change" : "Link"
                }}
              </button>
            </div>

            <!-- Credit Card -->
            <div
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 class="font-medium text-gray-900">Credit Card</h3>
                <p class="text-sm text-gray-500">
                  {{
                    user.paymentSettings.creditCard?.isLinked
                      ? `${user.paymentSettings.creditCard.type} ****${user.paymentSettings.creditCard.lastFourDigits}`
                      : "No credit card linked"
                  }}
                </p>
              </div>
              <button
                class="text-blue-600 hover:text-blue-700"
                @click="handleLinkCard"
              >
                {{
                  user.paymentSettings.creditCard?.isLinked ? "Change" : "Link"
                }}
              </button>
            </div>

            <BankLinkModal
              :is-open="showBankModal"
              @close="showBankModal = false"
              @linked="handleBankLinked"
            />

            <CardLinkModal
              :is-open="showCardModal"
              @close="showCardModal = false"
              @linked="handleCardLinked"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
        ></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-red-600">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { validation } from "@/utils/validation";
import { profileService } from "@/services/api/profile.service";
import BankLinkModal from "@/components/profile/BankLinkModal.vue";
import CardLinkModal from "@/components/profile/CardLinkModal.vue";
import ProfilePicture from "@/components/profile/ProfilePicture.vue";

const router = useRouter();
const { user, loading, error, checkAuth, logout } = useAuth();
const isEditing = ref(false);
const saveError = ref<string | null>(null);
const isSaving = ref(false);
const showBankModal = ref(false);
const showCardModal = ref(false);

const editForm = ref({
  name: "",
  preferredLanguage: "en" as const,
  phoneNumber: "",
});

const errors = ref({
  name: "",
  phoneNumber: "",
});

const paymentMethods = [
  { value: "credify_balance", label: "Credify Balance" },
  { value: "bank_account", label: "Bank Account" },
  { value: "credit_card", label: "Credit Card" },
] as const;

onMounted(async () => {
  try {
    await checkAuth();
    if (user.value) {
      editForm.value = {
        name: user.value.name,
        preferredLanguage: user.value.preferredLanguage as any,
        phoneNumber: user.value.phoneNumber || "",
      };
    }
  } catch (err) {
    console.error("Failed to load profile:", err);
    router.push("/login");
  }
});

const validateField = (field: "name" | "phoneNumber") => {
  errors.value[field] = "";

  if (field === "name") {
    const nameRequired = validation.name.required(editForm.value.name);
    if (typeof nameRequired === "string") {
      errors.value.name = nameRequired;
      return;
    }

    const nameLength = validation.name.length(editForm.value.name);
    if (typeof nameLength === "string") {
      errors.value.name = nameLength;
      return;
    }
  }

  if (field === "phoneNumber") {
    const phoneFormat = validation.phoneNumber.format(
      editForm.value.phoneNumber
    );
    if (typeof phoneFormat === "string") {
      errors.value.phoneNumber = phoneFormat;
      return;
    }
  }
};

const validateForm = () => {
  validateField("name");
  validateField("phoneNumber");
};

const hasErrors = computed(() =>
  Object.values(errors.value).some((error) => !!error)
);

const isFormValid = computed(
  () => editForm.value.name.trim() !== "" && !hasErrors.value
);

//JPY
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    currencyDisplay: "symbol",
  }).format(amount);
};

//myr
// const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat('ms-MY', {
//     style: 'currency',
//     currency: 'MYR',
//     currencyDisplay: 'symbol'
//   }).format(amount);
// };

const updateDefaultMethod = (
  method: (typeof paymentMethods)[number]["value"]
) => {
  // TODO: Implement API call to update default method
  console.log("Updating default method to:", method);
};

const handleLinkBank = () => {
  showBankModal.value = true;
};

const handleLinkCard = () => {
  showCardModal.value = true;
};

const handleBankLinked = (bankInfo: {
  bankName: string;
  lastFourDigits: string;
}) => {
  if (user.value && user.value.paymentSettings.bankAccount) {
    user.value.paymentSettings.bankAccount = {
      isLinked: true,
      ...bankInfo,
    };
  }
};

const handleCardLinked = (cardInfo: {
  type: string;
  lastFourDigits: string;
}) => {
  // Update user's card info
  if (user.value && user.value.paymentSettings.creditCard) {
    user.value.paymentSettings.creditCard = {
      isLinked: true,
      ...cardInfo,
    };
  }
};

const recentActivity = ref([
  { date: "2024-01-05", action: "Changed password" },
  { date: "2024-01-03", action: "Updated phone number" },
  { date: "2024-01-01", action: "Account created" },
]);

const handleProfilePictureUpdate = async (file: File) => {
  try {
    // Here you would typically upload the file to your server
    console.log("Uploading file:", file.name);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create a temporary URL for preview
    const imageUrl = URL.createObjectURL(file);
    if (user.value) {
      user.value.profilePicture = imageUrl;
    }
  } catch (error) {
    console.error("Failed to update profile picture:", error);
  }
};

const handleSave = async () => {
  validateForm();
  if (hasErrors.value) return;

  try {
    isSaving.value = true;
    saveError.value = null;

    const updatedUser = await profileService.updateProfile(editForm.value);
    user.value = updatedUser;
    isEditing.value = false;
  } catch (err) {
    saveError.value =
      err instanceof Error ? err.message : "Failed to save changes";
  } finally {
    isSaving.value = false;
  }
};

const handleLogout = () => {
  logout();
  router.push("/login");
};
</script>
