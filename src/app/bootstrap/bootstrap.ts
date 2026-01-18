const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const runBootstrapTasks = async () => {
  // TODO: 자동 로그인/초기 데이터 로딩 등 실제 부트스트랩 작업으로 대체
  await delay(3000)
}

export const bootstrapApp = async () => {
  await Promise.race([delay(3000), runBootstrapTasks()])
}
