# Multi-Agend Systems project - misinformation spread simulation
 Group 24 project for Tilburg University's Multi-Agent Systems course

# Implemented features:

## Publisher:
The publisher is the big Torus structure in the middle of the screen. When an agent visits the publisher, they 'read' some sort of publication, either true, or fake, news. This affects the agents' influence. The publisher is visited by agents each week.

The amount of fake news published can be adjusted using the slider

## Agent:
Has a score of influence (initialized at 0.0), and it varies from -1 (radically misinformed, and 1, radically informed)
Can be critically thinking or not - critically thinking agents increase their influence more rapidly when they read true news, and their influence decressed less rapdily, when they read fake news.

When agents talk to each other, it adjusts both agents' influence.

## Action:
Each day, an agent has a choice to talk with other agents, visit the publisher, or just do nothing. The spread is 1:1:1.

## Variable sliders:
	- Number of agents
	- Number of days to run the simulation for (increments by half year)
	- Speed of the simulation
	- Threshold of Critical Thinking (how many agents are critically thinking)
	- Published False Information