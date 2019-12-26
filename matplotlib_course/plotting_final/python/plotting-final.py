# reticulate::use_python('/usr/bin/python3')
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.collections import PolyCollection
from matplotlib import colors as mcolors


years = ['2014', '2015', '2016', '2017', '2018', '2019']

df_list = [0] * len(years)
for i in range(0, len(years)):
  df_list[i] = pd.read_csv('data/spartans_batting_' + years[i] + '.csv')


batting = pd.concat(df_list)

loc = batting['Loc']
notna = pd.notna(loc)
loc[~notna] = 'away'
loc[notna] = 'home'
print(notna.value_counts())

batting.to_csv('data/spartans_batting_2015-2019.csv', index=False)

wins = batting['W/L']
wins[wins == 'L'] = 0
wins[wins == 'W'] = 1
batting['W/L'] = wins

# Plotting a 3d waterfall plot of season by season 
# statistics with each depth being a season and the 
# height being the statistic 

fig = plt.figure()
ax = fig.gca(projection='3d')

def cc(arg):
    return mcolors.to_rgba(arg, alpha=1)

verts = []
years = ['2014', '2015', '2016', '2017', '2018', '2019']
seasons = range(0, len(years))
stat_name = 'W/L'

# next instead of by date we will aggregate statistics by team
# and make sure to normalize by the amount of games per team 

# counts =  batting['Opponent'].value_counts()
# opponents = counts[counts >= 15].index.to_list()
# opponents = [x for x in opponents if 'Michigan' in x]
opponents = ['Michigan State', 'Central Michigan', 'Michigan']
    
def add_one_bar(stat, team, season): 
  colors = ['blue', 'orange', 'teal', 'maroon', 'yellow', 'purple']
  # x, y, width, depth, top, shade
  ax.bar3d(team, season, 0, 1, .1, stat, shade = False, alpha = .6, color = colors[team])

    
for season in seasons:
  year_mask = batting['Date'].str.endswith(years[season])
  stat_list = [0] * len(opponents)
  
  for i in range(0, len(opponents)):
    stat = batting.loc[(batting['Opponent'] == opponents[i]) &
                  year_mask, stat_name].to_list()
                  
    if len(stat) > 0: 
      stat = sum(stat) / len(stat)
      add_one_bar(stat, i, season)

tick_offset = 0.25
ticks = list(range(0, len(opponents)))
ticks = [x + tick_offset for x in ticks]

ax.set_xlabel('')
ax.xaxis.set_ticks(ticks=ticks)
ax.xaxis.set_ticklabels(opponents)
ax.xaxis.set_tick_params(labelrotation = -25)
ax.set_xlim3d(0, len(opponents))
ax.yaxis.set_ticklabels(years)
ax.set_ylabel('Season')
ax.set_ylim3d(0, 7)
# ax.set_zlabel(stat_name)
ax.set_zlabel('Win %')
ax.set_zlim3d(0, 1)
ax.set_title('Michigan State Spartans Baseball Win Percentage Against Other Michigan Teams')

plt.show()

