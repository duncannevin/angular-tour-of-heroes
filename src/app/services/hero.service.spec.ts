import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { HeroService } from './hero.service';
import { MessageService } from './message.service'
import { Hero } from '../entities/hero'

const mockData: Hero[] = [
  { id: 1, name: 'one'},
  { id: 2, name: 'two'},
  { id: 3, name: 'three'}
] as Hero[]

describe('HeroService', () => {
  let heroService
  let httpTestingController
  let mockHeroes = [...mockData]
  let mockHero = mockHeroes[0]
  let mockId = mockHero.id

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [HeroService, MessageService]
    });
    httpTestingController = TestBed.get(HttpTestingController)

    heroService = TestBed.get(HeroService)
  })

  afterEach(() => {
    httpTestingController.verify()
  })

  it('should be created', () => {
    expect(heroService).toBeTruthy();
  })

  it('should get all the heroes', () => {
    spyOn(heroService, 'handleError').and.callThrough()
    spyOn(heroService, 'log').and.callThrough()

    heroService.getHeroes()
      .subscribe(
        heroes => expect(heroes.length).toEqual(mockHeroes.length),
        fail
      )

    // Receive GET request
    const req = httpTestingController.expectOne(heroService.heroesUrl);

    expect(req.request.method).toEqual('GET');
    // Respond with the mock heroes
    req.flush(mockHeroes)

    expect(heroService.log).toHaveBeenCalledTimes(1)
    expect(heroService.messageService.messages[0]).toEqual('HeroService: fetched heroes')
  })

  it('should get a hero', () => {
    spyOn(heroService, 'handleError').and.callThrough()
    spyOn(heroService, 'log').and.callThrough()

    heroService.getHero(mockId)
      .subscribe(
        hero => expect(hero).toEqual(mockHero),
        fail
      )
    const req = httpTestingController.expectOne(heroService.heroesUrl + `/${mockId}`);
    expect(req.request.method).toEqual('GET');
    // Respond with the mock hero
    req.flush(mockHero)

    expect(heroService.log).toHaveBeenCalledTimes(1)
    expect(heroService.messageService.messages[0]).toEqual(`HeroService: fetched hero id=${mockId}`)
  })

  it('should update a hero', () => {
    spyOn(heroService, 'handleError').and.callThrough()
    spyOn(heroService, 'log').and.callThrough()

    const updatedHero = {...mockHero, name: 'ted'}
    heroService.updateHero(updatedHero)
      .subscribe(
        hero => expect(hero).toEqual(updatedHero),
        fail
      )
    const req = httpTestingController.expectOne(heroService.heroesUrl)
    expect(req.request.method).toEqual('PUT')
    // Respond with the updated mock hero
    req.flush(updatedHero)
    
    expect(heroService.log).toHaveBeenCalledTimes(1)
    expect(heroService.messageService.messages[0]).toEqual(`HeroService: updated hero id=${mockId}`)
  })

  it('should add a hero', () => {
    spyOn(heroService, 'handleError').and.callThrough()
    spyOn(heroService, 'log').and.callThrough()

    const newHero = { id: 444, name: 'Added Hero'}

    heroService.addHero(newHero)
      .subscribe(
        hero => expect(hero).toEqual(newHero),
        fail
      )
    const req = httpTestingController.expectOne(heroService.heroesUrl)

    expect(req.request.method).toEqual('POST')
    req.flush(newHero)
    
    expect(heroService.log).toHaveBeenCalledTimes(1)
    expect(heroService.messageService.messages[0]).toEqual(`HeroService: added hero w/ id=${newHero.id}`)
  })

  it('should delete a hero', () => {
    spyOn(heroService, 'handleError').and.callThrough()
    spyOn(heroService, 'log').and.callThrough()

    heroService.deleteHero(mockId)
      .subscribe(
        hero => expect(hero).toEqual(mockHero),
        fail
      )

    const req = httpTestingController.expectOne(heroService.heroesUrl + `/${mockId}`)

    expect(req.request.method).toEqual('DELETE')
    req.flush(mockHero)
    
    expect(heroService.log).toHaveBeenCalledTimes(1)
    expect(heroService.messageService.messages[0]).toEqual(`HeroService: deleted hero id=${mockId}`)
  })

  it('should find all heroes with "t" in there name', () => {
    spyOn(heroService, 'handleError').and.callThrough()
    spyOn(heroService, 'log').and.callThrough()

    heroService.searchHeroes('t') .subscribe(
        heroes => {
          expect(heroes.length).toEqual(2)
          expect(heroes.filter(hero => {
            return hero.name === mockHeroes[1].name || hero.name === mockHeroes[2].name 
          }).length).toEqual(2)
        }
      )
    const req = httpTestingController.expectOne(heroService.heroesUrl + `?name=t`)
    expect(req.request.method).toEqual('GET')
    req.flush([mockHero[1], mockHeroes[2]])
    
    expect(heroService.log).toHaveBeenCalledTimes(1)
    expect(heroService.messageService.messages[0]).toEqual(`HeroService: found heroes matching "t"`)
  })

  it('should find hero "two" with the full name', () => {
    spyOn(heroService, 'handleError').and.callThrough()
    spyOn(heroService, 'log').and.callThrough()

    heroService.searchHeroes('two') .subscribe(
        heroes => {
          expect(heroes.length).toEqual(1)
          expect(heroes.map(h => h.name).includes('two')).toEqual(true)
        }
      )
    const req = httpTestingController.expectOne(heroService.heroesUrl + `?name=two`)
    expect(req.request.method).toEqual('GET')
    req.flush([mockHero[1]])
    
    expect(heroService.log).toHaveBeenCalledTimes(1)
    expect(heroService.messageService.messages[0]).toEqual(`HeroService: found heroes matching "two"`)
  })

  it('should gracefully handle a non-existant hero', () => {
    spyOn(heroService, 'handleError').and.callThrough()
    spyOn(heroService, 'log').and.callThrough()

    heroService.getHero(1234)
      .subscribe(
        expect(heroes => expect(heroes.length).toEqual(0)),
        fail
      )

    const req = httpTestingController.expectOne(heroService.heroesUrl + `/${1234}`)
    expect(req.request.method).toEqual('GET')
    req.flush([])

    expect(heroService.handleError).toHaveBeenCalledTimes(1)
  })
})
