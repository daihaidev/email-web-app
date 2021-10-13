import { App } from 'models/App'

const app = new App()
app.init()

window.app = app // for dev only

window.Enchant = data => app.initialData(data)

export { app }
