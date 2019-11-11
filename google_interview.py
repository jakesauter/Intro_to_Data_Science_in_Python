
# Now what if we don't have 5 cent pieces
def min_coins(cents): 
  if cents < 1:
    return 0

  coins = [25, 10, 5, 1]

  num_coins = 0

  for coin in coins:
    num_coins += cents // coin
    cents = cents % coin
    if cents == 0:
      break

  return num_coins

print min_coins(31)

def min_coins_dp(cents):
  if (cents < 1):
    return 0

  if (cents >= 25):
    quarters = cents // 25
    cents = cents - 25 * quarters

  num_coins = [0] * (cents + 1)
  num_coins[0] = 0
  coins = [10, 5, 1]
  for i in range(1, cents + 1):
     for coin in coins: 
        div = i // coin
        if div != 0: 
          num_coins[i] = div + num_coins[i % coin]
          break

  return num_coins[cents] + quarters
