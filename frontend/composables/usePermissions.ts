export const usePermissions = () => {
  const api = useApiClient()
  const user = useAuth()

  const permissions = ref<{
    role: string
    menus: string[]
    features: string[]
  } | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPermissions = async () => {
    if (!user.value?.user) return

    loading.value = true
    error.value = null

    try {
      const data = await api.get('/api/permissions')
      permissions.value = data
    } catch (err: any) {
      error.value = err?.data?.error || 'Failed to fetch permissions'
      console.error('Permissions fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const hasMenu = (menu: string) => {
    return permissions.value?.menus.includes(menu) ?? false
  }

  const hasFeature = (feature: string) => {
    return permissions.value?.features.includes(feature) ?? false
  }

  const canAccess = (menu: string, feature?: string) => {
    const hasMenuAccess = hasMenu(menu)
    const hasFeatureAccess = feature ? hasFeature(feature) : true
    return hasMenuAccess && hasFeatureAccess
  }

  // 사용자 로그인 시 권한 정보 자동 로드
  watch(() => user.value?.user, (newUser) => {
    if (newUser) {
      fetchPermissions()
    } else {
      permissions.value = null
    }
  }, { immediate: true })

  return {
    permissions: readonly(permissions),
    loading: readonly(loading),
    error: readonly(error),
    fetchPermissions,
    hasMenu,
    hasFeature,
    canAccess
  }
}