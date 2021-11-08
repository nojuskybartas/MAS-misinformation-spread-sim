import pygame, math, sys
from random import randint

pygame.init()

X = 900  # screen width
Y = 600  # screen height

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 50, 50)
YELLOW = (255, 255, 0)
GREEN = (0, 255, 50)
BLUE = (50, 50, 255)
GREY = (200, 200, 200)
ORANGE = (200, 100, 50)
CYAN = (0, 255, 255)
MAGENTA = (255, 0, 255)
TRANS = (1, 1, 1)


class Gradient():
    def __init__(self, palette, maximum):
        self.COLORS = palette
        self.N = len(self.COLORS)
        self.SECTION = maximum // (self.N - 1)

    def gradient(self, x):
        """
        Returns a smooth color profile with only a single input value.
        The color scheme is determinated by the list 'self.COLORS'
        """
        i = x // self.SECTION
        fraction = (x % self.SECTION) / self.SECTION
        c1 = self.COLORS[i % self.N]
        c2 = self.COLORS[(i+1) % self.N]
        col = [0, 0, 0]
        for k in range(3):
            col[k] = (c2[k] - c1[k]) * fraction + c1[k]
        return col

class Slider():
    def __init__(self, name, val, maxi, mini, pos):
        self.name = name
        self.val = int(val)  # start value
        self.maxi = maxi  # maximum at slider position right
        self.mini = mini  # minimum at slider position left
        self.xpos = pos  # x-location on screen
        self.ypos = 550
        self.surf = pygame.surface.Surface((100, 50))
        self.hit = False  # the hit attribute indicates slider movement due to mouse interaction

        self.txt_surf = font.render(name, 1, BLACK)
        self.txt_rect = self.txt_surf.get_rect(center=(50, 15))

        # Static graphics - slider background #
        self.surf.fill((100, 100, 100))
        pygame.draw.rect(self.surf, GREY, [0, 0, 100, 50], 3)
        pygame.draw.rect(self.surf, ORANGE, [10, 10, 80, 10], 0)
        pygame.draw.rect(self.surf, WHITE, [10, 30, 80, 5], 0)

        self.surf.blit(self.txt_surf, self.txt_rect)  # this surface never changes

        # dynamic graphics - button surface #
        self.button_surf = pygame.surface.Surface((20, 20))
        self.button_surf.fill(TRANS)
        self.button_surf.set_colorkey(TRANS)
        pygame.draw.circle(self.button_surf, BLACK, (10, 10), 6, 0)
        pygame.draw.circle(self.button_surf, ORANGE, (10, 10), 4, 0)

    def draw(self):
        """ Combination of static and dynamic graphics in a copy of
    the basic slide surface
    """
        # static
        surf = self.surf.copy()

        # dynamic
        pos = (10+int((self.val-self.mini)/(self.maxi-self.mini)*80), 33)
        self.button_rect = self.button_surf.get_rect(center=pos)
        surf.blit(self.button_surf, self.button_rect)
        self.button_rect.move_ip(self.xpos, self.ypos)  # move of button box to correct screen position

        # screen
        screen.blit(surf, (self.xpos, self.ypos))

    def move(self):
        """
    The dynamic part; reacts to movement of the slider button.
    """
        self.val = int((pygame.mouse.get_pos()[0] - self.xpos - 10) / 80 * (self.maxi - self.mini) + self.mini)
        if self.val < self.mini:
            self.val = self.mini
        if self.val > self.maxi:
            self.val = self.maxi

class InfoDisplay():
    def __init__(self, posX, posY):
        self.posX = posX
        self.posY = posY
        self.font = pygame.font.SysFont("Verdana", 18)
        self.color = GREEN     

    def draw(self):
        days_elapsed_info = self.font.render('day {}/{}'.format(days_elapsed, days.val), 1, self.color)        
        agent_count_info = self.font.render('{} agents'.format(agent_slider.val), 1, self.color)
        publisher_count_info = self.font.render('{} publishers'.format(len(publishers)), 1, self.color)
        speed_info = self.font.render('Speed: {}'.format(speed.val), 1, self.color)
        run_text = self.font.render('run simulation', 1, MAGENTA)
        screen.blit(days_elapsed_info, (self.posX, self.posY+25))
        screen.blit(agent_count_info, (self.posX, self.posY))
        screen.blit(publisher_count_info, (self.posX-150, self.posY))
        screen.blit(speed_info, (self.posX, self.posY+50))
        screen.blit(run_text , (X-150,90))

class Publisher():
    def __init__(self, number, pos, science_ratio):
        self.n = number
        self.releases = []
        self.science_ratio = science_ratio
        for _ in range(science_ratio[0]):
            self.releases.append(1)
        for _ in range(science_ratio[1]):
            self.releases.append(0)
        self.posX, self.posY = pos
        self.color = YELLOW

    def publish(self):
        # spread information to the audience
        return self.releases[randint(0, len(self.releases)-1)]

    def update_size(self, size):
        self.size = int(size)
        self.surf = pygame.surface.Surface((self.size/3*2, self.size/2))
        self.font = pygame.font.SysFont("Verdana", int(self.size/6))
        self.name = self.font.render('Publ {}'.format(self.n), 1, self.color)
        self.info = self.font.render('{}/{}'.format(self.science_ratio[0], self.science_ratio[1]), 1, self.color)
        
    def draw(self):
        self.update_size(size.val)
        pygame.draw.rect(self.surf, self.color, [0,0,self.size/3*2, self.size/2], 3, 1)
        screen.blit(self.surf, (self.posX, self.posY))
        screen.blit(self.name, (self.posX+self.size/12, self.posY+self.size/12))
        screen.blit(self.info, (self.posX+self.size/6, self.posY+self.size/4))

class Agent():
    def __init__(self, scientist, init_influence, init_pos, number, size = 1):
        self.n = number
        self.influence = init_influence
        self.scientist = scientist
        self.originX, self.originY = init_pos
        self.posX, self.posY = init_pos

        self.partner = None
        self.publisher = None

        self.update_size()
        self.update_color(GREEN if self.scientist is True else RED)
    
    def find_partner(self, random_agent):
        self.partner = random_agent

    def move(self):

        if self.publisher is not None:
            self.moveTowards(self.publisher)
            if self.atEntity(self.publisher):
                self.read()

        elif self.partner is not None:
            self.moveTowards(self.partner)
            if self.atEntity(self.partner):
                self.talk()
        
        else:
            self.posX += (self.originX-self.posX)/40
            self.posY += (self.originY-self.posY)/40
            
    
    def moveTowards(self, entity):
        if abs(self.posX - entity.posX) > 5:
            self.posX += (entity.posX-self.posX)/50
        if abs(self.posY - entity.posY) > 5:
            self.posY += (entity.posY-self.posY)/20

    def atEntity(self, entity):
        if abs(self.posX-entity.posX)<=5 and abs(self.posY-entity.posY)<=5:
            return True
        return False

    def atOrigin(self):
        if abs(self.posX-self.originX)<=5 and abs(self.posY-self.originY)<=5:
            return True
        return False

    def read(self):
        # positive publication
        if self.publisher.publish() == 1:
            self.influence += 0.05 if self.scientist else 0.15
        # negative publication
        else:
            self.influence -= 0.01 if self.scientist else 0.30

    def talk(self):
        #exchange (mis)information with partner here
        self.influence, self.partner.influence = self.influence + self.partner.influence*0.1, self.partner.influence + self.influence*0.1
        self.partner = None

    def update_size(self):
        self.size = (100 - focus.val)/10 if self.scientist else focus.val/10
        self.surf = pygame.surface.Surface((self.size, self.size))

    def update_color(self, color):
        self.color = color
        pygame.draw.rect(self.surf, self.color, [0, 0, self.size, self.size], 0)
        self.name = font.render(str(self.n), 1, self.color)

    def draw(self):
        self.update_color(xcolor(int(self.influence*1000)))
        self.info = font.render(str(self.influence)[:4], 1, self.color)
        screen.blit(self.surf, (self.posX, self.posY))
        screen.blit(self.info, (self.posX-15, self.posY))

font = pygame.font.SysFont("Verdana", 8)
screen = pygame.display.set_mode((X, Y))
clock = pygame.time.Clock()

COLORS = [RED, GREEN]
xcolor = Gradient(COLORS, X).gradient

p_amount = Slider("Publishers", 3, 10, 1, 25)
p_spread = Slider("(sci) Publisher Spread (Not)", 0, 15, -15, 150) #left is scientist, right is normal
size = Slider("Publisher Size", 100, 100, 5, 275)
agent_slider = Slider("Agents", 2, 1000, 2, 400)
focus = Slider("(Sci) Focus (Not)", 50, 100, 0, 525) #left is scientist, right is normal
days = Slider("Days", 1, 100, 1, 650)
speed = Slider("Speed", 50, 250, 10, 775)
slides = [p_amount, p_spread, days, size, focus, agent_slider, speed]

def setup_publishers():
    publishers = []
    for i in range(p_amount.val):
        pos = i/p_amount.val*X+50/p_amount.val, Y/5*4
        #pos = i/num*size.val*bend.val+X/num*2, Y/5*2-bend.val-size.val/50
        if p_spread.val > 0:
            spread = [1, randint(1, p_spread.val)]
        elif p_spread.val < 0:
            spread = [randint(1, abs(p_spread.val)), 1]
        else:
            spread = [1,1]
        publishers.append(Publisher(i+1, pos, spread))
    return publishers

def setup_agents():
    agents = []
    starting_pos = [2*math.pi / agent_slider.val * i - math.pi for i in range(agent_slider.val)]
    for x in range(agent_slider.val):
        init_pos = math.sin(starting_pos[x])*200+X/2, math.cos(starting_pos[x])*200+Y/5*2
        scientist = True if randint(0, 1) == 0 else False
        init_influence = 0.00
        agents.append(Agent(scientist, init_influence, init_pos, x))
    return agents

def find_partners():
    taken_partners = []
    random_offset = randint(0, 1)
    for i in range(int(agent_slider.val)):
        if i%2==random_offset:
            partner_found = False
            while not partner_found:
                random_partner = randint(int(agent_slider.val/2), agent_slider.val-1)
                if random_partner not in taken_partners:
                    agents[i].find_partner(agents[random_partner])
                    #agents[random_partner].find_partner(agents[i])
                    taken_partners.append(random_partner)
                    partner_found = True

def find_publishers():
    for agent in agents:
        agent.publisher = publishers[randint(0, len(publishers)-1)]

def day_ended():
    for agent in agents:
        if not agent.atOrigin():
            return False
    else:
        return True

def start_simulation():
    pass

def reset_env():
    global agents, publishers, start_pressed, days_elapsed

    agents = setup_agents()
    publishers = setup_publishers()
    start_pressed = False
    days_elapsed = 0

infodisplay = InfoDisplay(X-120, 10)
agents = setup_agents()
publishers = setup_publishers()
days_elapsed = 0
start_pressed = False

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        elif event.type == pygame.MOUSEBUTTONDOWN:
            pos = pygame.mouse.get_pos()
            for s in slides:
                if s.button_rect.collidepoint(pos):
                    s.hit = True
            if X-150 <= pos[0] <= X-20 and 90 <= pos[1] <= 90+20:
                print('running simulation')
                start_pressed = True
                start_simulation()
        elif event.type == pygame.MOUSEBUTTONUP:
            for s in slides:
                if s.name == ('Agents') and s.hit:
                    reset_env()
                s.hit = False

    # Move slides
    slider_activated = False
    for s in slides:
        if s.hit:
            s.move()
            if ('Focus') in s.name:
                for agent in agents:
                    agent.update_size()
            if ('Size') in s.name:
                for publisher in publishers:
                    publisher.update_size(size.val)
            elif ('Publisher') in s.name:
                publishers = setup_publishers()
            slider_activated = True

    # Update screen
    screen.fill(BLACK)

    # Utils
    infodisplay.draw()
    for s in slides:
        s.draw()
    
    if day_ended() and not slider_activated and start_pressed and days_elapsed<days.val:
        days_elapsed += 1
        # visit publishers every week
        if days_elapsed % 2 == 1:
            find_publishers()
        else:
            find_partners()

    if start_pressed:
        for agent in agents:
            agent.move()
            if agent.publisher is not None and agent.atEntity(agent.publisher):
                agent.publisher = None
    
    [agent.draw() for agent in agents]
    [publisher.draw() for publisher in publishers]

    pygame.display.flip()
    clock.tick(speed.val)