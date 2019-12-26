import pandas as pd

df = pd.DataFrame([
{'Name': 'Vinny', 'car purchased': 'lambo'},
{'Name': 'Pauly', 'car purchased': 'porshe'},
{'Name': 'Jerry', 'car purchased': 'mazda'}, 
])

df['Date'] = ['04/20/1997', '09/17/2019', '04/14/2012']

df['Delivered'] = True

df['Feedback'] = ['Pos', None, 'Neg']

# When adding data to a pandas data frame 
# we can just instert a series built from a dictionary
# of keys corresponding to index and values corresponding 
# to the values that we would like to add

df.reset_index()

df['Date'] = pd.Series({0: 'Dec 1', 2: 'mid-may'})


