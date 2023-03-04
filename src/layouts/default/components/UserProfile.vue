<script setup lang="ts">
import avatar from "@/assets/mercedez.jpg";
import { useAppStore } from "@/store/app";

const { loggedInUser } = useAppStore();
</script>

<template>
  <v-badge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <v-avatar style="cursor: pointer" color="primary" variant="tonal">
      <!-- <v-img :alt="loggedInUser.username" :src="avatar" /> -->
      <v-icon icon="mdi-account-circle" size="40"></v-icon>

      <!-- SECTION Menu -->
      <v-menu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <v-list>
          <!-- 👉 User Avatar & Name -->
          <v-list-item>
            <template #prepend>
              <v-list-item-action start>
                <v-badge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                  bordered
                >
                  <v-avatar color="primary" size="40" variant="tonal">
                    <!-- <v-img :alt="loggedInUser.username" :src="avatar" /> -->
                    <v-icon icon="mdi-account-circle" size="40"></v-icon>
                  </v-avatar>
                </v-badge>
              </v-list-item-action>
            </template>

            <v-list-item-title class="font-weight-semibold">
              {{ loggedInUser.username }}
            </v-list-item-title>
          </v-list-item>

          <v-divider class="my-2" />

          <!-- 👉 Profile -->
          <v-list-item link>
            <template #prepend>
              <v-icon class="me-2" icon="mdi-account-outline" size="22" />
            </template>

            <v-list-item-title>Tài khoản</v-list-item-title>
          </v-list-item>

          <!-- 👉 FAQ -->
          <!-- <v-list-item link>
                        <template #prepend>
                          <v-icon class="me-2" icon="mdi-help-circle-outline" size="22" />
                        </template>

                        <v-list-item-title>FAQ</v-list-item-title>
                      </v-list-item> -->

          <!-- Divider -->
          <v-divider class="my-2" />

          <!-- 👉 Logout -->
          <v-list-item to="/login">
            <template #prepend>
              <v-icon class="me-2" icon="mdi-logout-variant" size="22" />
            </template>

            <v-list-item-title>Đăng xuất</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- !SECTION -->
    </v-avatar>
  </v-badge>
</template>
