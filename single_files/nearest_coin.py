
"""
reticulate::repl_python()
"""
  
"""
--------------------------------------
| . | . | . | . | . | . | . | . | . |
| . | x | . | . | . | . | . | . | . |
| . | . | . | . | o | . | . | . | . |
| . | . | . | . | . | . | . | . | . |
| o | . | . | . | . | . | . | . | . |
| . | . | o | . | . | . | . | . | . |
| . | . | . | . | . | . | . | . | . |
| . | . | . | . | . | . | . | . | . |
| . | . | . | . | . | . | . | . | . |
| . | . | . | . | . | . | . | . | . |
-------------------------------------

We are on a grid, and have the location of every coin. Our
objective is to find the nearest coin
"""

def shortest_path(pos, coins): 
  shortest_path = -1
  shortest_path_index = -1
  for i in range(0, len(coins)):
    xdist = abs(pos[0] - coins[i][0])
    ydist = abs(pos[1] - coins[i][1])
    totaldist = xdist + ydist
    
    if totaldist < shortest_path or shortest_path == -1:
      shortest_path = totaldist
      shortest_path_index = i
    
  return(coins[shortest_path_index])

"""
Now lets say that we have a really large board. Now our O(n) time algorith
doesn't seem to make much sense anymore ; iterating through every coin
when we really only need to check the few closest coins 

BFS (breadth first search) might be a possiblity here

We not have the stipulation where up front we know the grid size, and 
it might be best to switch between BST and our simple coin algorithm 
written above
"""

coins = [(3,3), (5,5)]
pos = (1,1)

shortest_path(pos, coins)





















