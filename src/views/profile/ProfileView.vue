// src/views/profile/ProfileView.vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { user, loading, error, checkAuth, logout } = useAuth();

onMounted(async () => {
  try {
    await checkAuth();
  } catch (err) {
    console.error('Failed to load profile:', err);
  }
});

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>