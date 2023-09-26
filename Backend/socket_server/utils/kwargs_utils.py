'''
contains utility functions for all keyword argument operations
'''


def cherry_pick(key_list:list, kwarg_dict:dict={})->list | tuple:
    value_list = []
    for key in key_list:
        value_list.append(kwarg_dict.get(key))
    return value_list