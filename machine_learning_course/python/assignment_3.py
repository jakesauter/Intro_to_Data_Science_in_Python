
# coding: utf-8

# ---
# 
# _You are currently looking at **version 1.2** of this notebook. To download notebooks and datafiles, as well as get help on 
# Jupyter notebooks in the Coursera platform, visit the [Jupyter Notebook FAQ]
# (https://www.coursera.org/learn/python-machine-learning/resources/bANLa) course resource._
# 
# ---

# # Assignment 3 - Evaluation
# 
# In this assignment you will train several models and evaluate how effectively they predict 
# instances of fraud using data based on [this dataset from Kaggle](https://www.kaggle.com/dalpozz/creditcardfraud).
#  
# Each row in `fraud_data.csv` corresponds to a credit card transaction. Features include 
# confidential variables `V1` through `V28` as well as `Amount` which is the amount of the transaction. 
#  
# The target is stored in the `class` column, where a value of 1 corresponds to an instance of fraud 
# and 0 corresponds to an instance of not fraud.

# In[ ]:

import numpy as np
import pandas as pd

# Use X_train, X_test, y_train, y_test for all of the following questions
from sklearn.model_selection import train_test_split

# df = pd.read_csv('readonly/fraud_data.csv')
df = pd.read_csv('fraud_data.csv')

X = df.iloc[:,:-1]
y = df.iloc[:,-1]

X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)

# ### Question 1
# Import the data from `fraud_data.csv`. What percentage of the 
# observations in the dataset are instances of fraud?
# 
# *This function should return a float between 0 and 1.* 

# In[ ]:

def answer_one():
    
    # df = pd.read_csv('readonly/fraud_data.csv')
    df = pd.read_csv('fraud_data.csv')
    counts = df.Class.value_counts()
    ans = counts[1] / sum(counts)
    
    return ans


# In[ ]:



# ### Question 2
# 
# Using `X_train`, `X_test`, `y_train`, and `y_test` (as defined above), 
# train a dummy classifier 
# that classifies everything as the majority class of the training data. 
# What is the accuracy of this classifier? What is the recall?
# 
# *This function should a return a tuple with two floats, i.e. 
# `(accuracy score, recall score)`.*

# In[ ]:

def answer_two():
    from sklearn.dummy import DummyClassifier
    from sklearn.metrics import recall_score, accuracy_score

    clf = DummyClassifier(strategy='most_frequent')
    
    clf = clf.fit(X_train, y_train)
    
    preds = clf.predict(X_test)
    
    acc = accuracy_score(y_test, preds)
    recall = recall_score(y_test, preds)
    
    return (acc, recall)


# ### Question 3
# 
# Using X_train, X_test, y_train, y_test (as defined above), train a SVC classifer 
# using the default parameters. What is the accuracy, recall, and precision of 
# this classifier?
# 
# *This function should a return a tuple with three floats, 
# i.e. `(accuracy score, recall score, precision score)`.*

# In[ ]:

def answer_three():
    from sklearn.metrics import recall_score, precision_score, accuracy_score
    from sklearn.svm import SVC

    clf = SVC()
    
    clf.fit(X_train, y_train)
    
    preds = clf.predict(X_test)
    
    acc = accuracy_score(y_test, preds)
    recall = recall_score(y_test, preds)
    precision = precision_score(y_test, preds)
    
    return (acc, recall, precision)


# ### Question 4
# 
# Using the SVC classifier with parameters `{'C': 1e9, 'gamma': 1e-07}`, 
# what is the confusion 
# matrix when using a threshold of -220 on the decision function. 
# Use X_test and y_test.
# 
# *This function should return a confusion matrix, a 2x2 numpy array with 4 integers.*

# In[ ]:

def answer_four():
    from sklearn.metrics import confusion_matrix
    from sklearn.svm import SVC

    clf = SVC(C=1e9, gamma=1e-07, random_state=0)
    clf.fit(X_train, y_train)
    preds = clf.decision_function(X_test)
    preds[preds > -220] = 1
    preds[preds < -220] = 0
    conf_mat = confusion_matrix(y_test, preds)
    
    return conf_mat


# ### Question 5
# 
# Train a logisitic regression classifier with default parameters
# using X_train and y_train.
# 
# For the logisitic regression classifier, create a precision recall curve and a roc 
# curve using y_test and the probability estimates for X_test (probability it is fraud).
# 
# Looking at the precision recall curve, what is the recall when the precision is `0.75`?
# 
# Looking at the roc curve, what is the true positive rate when the false positive rate is `0.16`?
# 
# *This function should return a tuple with two floats, i.e. `(recall, true positive rate)`.*

# In[ ]:

def answer_five():
    # import matplotlib.pyplot as plt
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import precision_recall_curve
    from sklearn.metrics import roc_curve
    
    clf = LogisticRegression()
    clf.fit(X_train, y_train)
    preds = clf.predict_proba(X_test)[:,1]
    prec, rec, thresh = precision_recall_curve(y_test, preds)
    
    # def pr_curve(prec, rec):
    #     plt.figure()
    #     plt.xlim([0.0, 1.01])
    #     plt.ylim([0.0, 1.01])
    #     plt.plot(prec, rec, label = 'Precision-Recall Curve')
    #     plt.xlabel('Precision', fontsize=16)
    #     plt.ylabel('Recall', fontsize=16)
    #     plt.axes().set_aspect('equal')
    #     plt.show()    
        
        
    # What is the recall when the precision is 0.75?
    # pr_curve(prec, rec)
    rec[prec == 0.75]
    # 0.825
    
    
    fpr_lr, tpr_lr, _ = roc_curve(y_test, preds)
    
    # def plot_roc_curve(fpr, tpr):
    #     plt.figure()
    #     plt.xlim([-0.01, 1.00])
    #     plt.ylim([-0.01, 1.00])
    #     plt.plot(fpr, tpr, lw=3, label='LogReg ROC curve')
    #     plt.xlabel('FPR', fontsize=16)
    #     plt.ylabel('TPR', fontsize=16)
    #     plt.legend(loc='lower right', fontsize=13)
    #     plt.plot([0,1], [0, 1]), color='navy', lw=3, linestyle='--')
    #     plt.axes().set_aspect('equal')
    #     plt.show()

    
    # plot_roc_curve(fpr_lr, tpr_lr)
    return (0.825, 0.925)


# ### Question 6
# 
# Perform a grid search over the parameters listed below for 
# a Logisitic Regression classifier, 
# using recall for scoring and the default 3-fold cross validation.
# 
# `'penalty': ['l1', 'l2']`
# 
# `'C':[0.01, 0.1, 1, 10, 100]`
# 
# From `.cv_results_`, create an array of the mean 
# test scores of each parameter
# combination. i.e.
# 
# |      	| `l1` 	| `l2` 	|
# |:----:	|----	|----	|
# | **`0.01`** 	|    ?	|   ? 	|
# | **`0.1`**  	|    ?	|   ? 	|
# | **`1`**    	|    ?	|   ? 	|
# | **`10`**   	|    ?	|   ? 	|
# | **`100`**   	|    ?	|   ? 	|
# 
# <br>
# 
# *This function should return a 5 by 2 numpy array with 10 floats.* 
#
# *Note: do not return a DataFrame, just the values denoted by '?' 
# above in a numpy array. 
# You might need to reshape your raw result to meet the format we 
# are looking for.*

# In[ ]:

def answer_six():    
    from sklearn.model_selection import GridSearchCV
    from sklearn.linear_model import LogisticRegression

    clf = LogisticRegression(random_state=0)

    grid = GridSearchCV(clf, param_grid={'penalty': ['l1', 'l2'], 
                                        'C':[0.01, 0.1, 1, 10, 100]}, 
                                        scoring='recall', 
                                        cv=3)
                                        
    grid.fit(X_train, y_train)
    
    results = grid.cv_results_
    params = results['params']
    scores = results['mean_test_score']
    
    for i in range(len(params)): 
        params[i]['score'] = scores[i]

    C_vals = [0.01, 0.1, 1, 10, 100]
    df = pd.DataFrame(index = C_vals, columns=['l1', 'l2'])

    for param in params:
        df[param['penalty']][param['C']] = param['score']
        
    # return df.to_numpy()
    return df.values


# In[ ]:

# Use the following function to help visualize results from the grid search
def GridSearch_Heatmap(scores):
    get_ipython().magic('matplotlib notebook')
    import seaborn as sns
    import matplotlib.pyplot as plt
    plt.figure()
    sns.heatmap(scores.reshape(5,2), xticklabels=['l1','l2'], yticklabels=[0.01, 0.1, 1, 10, 100])
    plt.yticks(rotation=0);

#GridSearch_Heatmap(answer_six())

