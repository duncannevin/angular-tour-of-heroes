import { TestBed } from '@angular/core/testing'

import { MessageService } from './message.service'

describe('MessageService', () => {
  let service

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.get(MessageService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should add a message', () => {
    const message: string = 'this is a test of the emergency broad'
    service.add(message)
    expect(service.messages.length).toEqual(1)
  })

  it('should clear all messages', () => {
    service.clear()
    expect(service.messages.length).toEqual(0)
  })
})
