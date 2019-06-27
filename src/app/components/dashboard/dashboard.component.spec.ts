import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { of } from 'rxjs'

import { DashboardComponent } from './dashboard.component'
import { HeroSearchComponent } from '../hero-search/hero-search.component'
import { HeroService } from '../../services/hero.service'
import { Hero } from '../../entities/hero'

const mockData: Hero[] = [
  { id: 1, name: 'one'},
  { id: 2, name: 'two'},
  { id: 3, name: 'three'}
] as Hero[]

describe('DashboardComponent', () => {
  let component: DashboardComponent
  let fixture: ComponentFixture<DashboardComponent>
  let heroService
  let getHeroesSpy

  beforeEach(async(() => {
    // mock and spy on heroService, specifically 'getHeroes'
    heroService = jasmine.createSpyObj('HeroService', ['getHeroes'])
    // use mock data with heroService
    getHeroesSpy = heroService.getHeroes.and.returnValue( of(mockData) )

    TestBed.configureTestingModule({
      declarations: [ 
        DashboardComponent,
        HeroSearchComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
      providers: [
        { provide: HeroService, useValue: heroService} // provide mocked hero service
      ]
    })
    .compileComponents();
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  // tests what is rendered
  it('should display "Top Heroes" as headline', () => {
    expect(fixture.nativeElement.querySelector('h3').textContent).toEqual('Top Heroes')
  })

  // test that the service was called 
  it('should call heroService', async(() => {
    expect(getHeroesSpy.calls.any()).toBe(true)
  }))

  it('should display 3 links', async(() => {
    expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(3)
  }))
})
