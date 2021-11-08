# Multi-Agend Systems project - misinformation spread simulation
 Group 24 project for Tilburg University's Multi-Agent Systems course

# Implemented features:

## Publisher:
Normal/Scientific publication ratio (eg. 1:5, which means that there is one normal publication and 5 scientific ones. Nevertheless, each agent will randomly pick only one publication to read each time)

## Agent:
Has a score of influence (initialized at 0.0)
Can be scientist or not (currently initialized at 1:1 ratio)

Agents visit a publisher every X days, where they either read a good or bad publication. This in turn either increases or decreases their influence by a certain amount, depending on whether they are a scientist or not. 

Every day finds a partner and talks with them. This affects both agents' influence accordingly (haven't implemented how yet - i.e. the exact amount of influence delta is yet not decided.)

## Variable sliders:
	- Number of publishers
	- Publisher spread (Maximum ratio between scientific/normal publications, e.g. 1:15 means there's 1 scientific paper published to every 15 non-scientific papers published)
	- Publisher size (Purely aesthetic - choose the size of the publisher objects)
	- Number of agents
	- Agent focus (Choose to focus on scientists or non-scientists)
	- Number of days to run the simulation for
	- Agent speed
	
# TODO:
Redo the speed slider to not reset the simulation on change
Implement some colour code for the agents to follow
Implement some sort of data output after the simulation is done (need to know what data we're looking for)
Finish the influence exchange function (agent talking)
Add sliders (agent variables: initial influence, influence spread? (initialize agents according to normal distribution), scientist or not-scientist spread/ratio, influence spread multiplier)

Need more explanation for critical thinking & network parts before implementation
