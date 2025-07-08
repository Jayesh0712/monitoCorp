import { rest } from 'msw'
import { User, Service, ServiceEvent } from '@/mocks/data'
import { 
  services, 
  users, 
  startEventSimulation, 
  getEventsForService, 
  getStoredEvents,
  addEventToStorage
} from './data'

function getNextEventId(): number {
  const events = getStoredEvents();
  if (events.length === 0) return 1;
  
  const maxId = Math.max(...events.map(event => event.id));
  return maxId + 1;
}

startEventSimulation();

export const handlers = [

  // LOGIN
  rest.post('/api/login', async (req, res, ctx) => {
    const { username, password } = await req.json()
    const user = users.find((u: User) => u.username === username && u.password === password)

    if (!user) {
      return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }))
    }

    return res(ctx.delay(500), ctx.status(200), ctx.json({ id: user.id, username: user.username }))
  }),

  // GET ALL SERVICES
  rest.get('/api/services', (req, res, ctx) => {
    const name = req.url.searchParams.get('name_like')
    const status = req.url.searchParams.get('status')
    const type = req.url.searchParams.get('type')

    let combined = [...services]

    const stored = localStorage.getItem('extra_services')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        combined = [...combined, ...parsed]
      } catch (e) {
        console.warn('Invalid localStorage services:', e)
      }
    }

    if (name) {
      combined = combined.filter((s) => s.name.toLowerCase().includes(name.toLowerCase()))
    }
    if (status && status !== 'All') {
      combined = combined.filter((s) => s.status === status)
    }
    if (type && type !== 'All') {
      combined = combined.filter((s) => s.type === type)
    }
    return res(ctx.delay(300), ctx.status(200), ctx.json(combined))
  }),

  // GET SINGLE SERVICE
  rest.get('/api/services/:id', (req, res, ctx) => {
    const { id } = req.params

    const stored = localStorage.getItem('extra_services')
    const local = stored ? JSON.parse(stored) : []

    const service = services.find((s: Service) => s.id === id) || local.find((s: Service) => s.id === id)
    if (!service) return res(ctx.status(404))

    return res(ctx.status(200), ctx.json(service))
  }),

  // CREATE SERVICE
  rest.post('/api/services', async (req, res, ctx) => {
    const { name, type } = await req.json()
    const newService = {
      id: crypto.randomUUID(),
      name,
      type,
      status: 'Offline',
    }

    const stored = localStorage.getItem('extra_services')
    const existing = stored ? JSON.parse(stored) : []
    const updated = [...existing, newService]
    localStorage.setItem('extra_services', JSON.stringify(updated))

    const creationEvent: ServiceEvent = {
      id: getNextEventId(), // Fixed: use proper ID generation
      serviceId: newService.id,
      timestamp: new Date().toISOString(),
      message: `Service ${newService.name} was created`,
    }
    addEventToStorage(creationEvent)

    return res(ctx.delay(300), ctx.status(200), ctx.json(newService))
  }),

  // UPDATE SERVICE 
  rest.put('/api/services/:id', async (req, res, ctx) => {
    const { id } = req.params
    const updated = await req.json()

    const indexInSeed = services.findIndex((s: Service) => s.id === id)
    let updatedService;
    
    if (indexInSeed !== -1) {
      const oldService = { ...services[indexInSeed] }
      services[indexInSeed] = { ...services[indexInSeed], ...updated }
      updatedService = services[indexInSeed]
      
      if (oldService.status !== updatedService.status) {
        const statusEvent: ServiceEvent = {
          id: getNextEventId(), 
          serviceId: `${id}`,
          timestamp: new Date().toISOString(),
          message: `Service status changed from ${oldService.status} to ${updatedService.status}`,
        }
        addEventToStorage(statusEvent)
      }
      return res(ctx.status(200), ctx.json(updatedService))
    }

    const stored = localStorage.getItem('extra_services')
    const local = stored ? JSON.parse(stored) : []
    const indexInLocal = local.findIndex((s: Service) => s.id === id)

    if (indexInLocal !== -1) {
      const oldService = { ...local[indexInLocal] }
      local[indexInLocal] = { ...local[indexInLocal], ...updated }
      updatedService = local[indexInLocal]
      localStorage.setItem('extra_services', JSON.stringify(local))
      
      if (oldService.status !== updatedService.status) {
        const statusEvent: ServiceEvent = {
          id: getNextEventId(),
          serviceId: `${id}`,
          timestamp: new Date().toISOString(),
          message: `Service status changed from ${oldService.status} to ${updatedService.status}`,
        }
        addEventToStorage(statusEvent)
      }
      
      return res(ctx.status(200), ctx.json(updatedService))
    }

    return res(ctx.status(404))
  }),

  // DELETE SERVICE 
  rest.delete('/api/services/:id', (req, res, ctx) => {
    const { id } = req.params

    const indexInSeed = services.findIndex((s: Service) => s.id === id)
    if (indexInSeed !== -1) {
      const deletedService = services[indexInSeed]
      services.splice(indexInSeed, 1)
      
      const deletionEvent: ServiceEvent = {
        id: getNextEventId(), 
        serviceId: `${id}`,
        timestamp: new Date().toISOString(),
        message: `Service ${deletedService.name} was deleted`,
      }
      addEventToStorage(deletionEvent)
      
      return res(ctx.status(200))
    }

    const stored = localStorage.getItem('extra_services')
    const local = stored ? JSON.parse(stored) : []
    const serviceToDelete = local.find((s: Service) => s.id === id)
    const filtered = local.filter((s: Service) => s.id !== id)

    if (filtered.length !== local.length) {
      localStorage.setItem('extra_services', JSON.stringify(filtered))
      
      // Add deletion event
      if (serviceToDelete) {
        const deletionEvent: ServiceEvent = {
          id: getNextEventId(), 
          serviceId: `${id}`,
          timestamp: new Date().toISOString(),
          message: `Service ${serviceToDelete.name} was deleted`,
        }
        addEventToStorage(deletionEvent)
      }
      
      return res(ctx.status(200))
    }

    return res(ctx.status(404))
  }),

  // GET SERVICE EVENTS 
  rest.get('/api/services/:id/events', (req, res, ctx) => {
    const { id } = req.params as { id: string }
    const page = Number(req.url.searchParams.get('page') || 1)
    const limit = Number(req.url.searchParams.get('limit') || 10)
  
    const allEvents = getEventsForService(id)
      .sort((a: ServiceEvent, b: ServiceEvent) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  
    const start = (page - 1) * limit
    const paginated = allEvents.slice(start, start + limit)
  
    return res(ctx.delay(300), ctx.status(200), ctx.json(paginated))
  }),

  // GET ALL EVENTS 
  rest.get('/api/events', (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page') || 1)
    const limit = Number(req.url.searchParams.get('limit') || 10)
  
    const allEvents = getStoredEvents()
      .sort((a: ServiceEvent, b: ServiceEvent) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  
    const start = (page - 1) * limit
    const paginated = allEvents.slice(start, start + limit)
  
    return res(ctx.delay(300), ctx.status(200), ctx.json(paginated))
  }),
  
]