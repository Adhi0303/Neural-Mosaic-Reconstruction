import torch
import torch.nn as nn

def calc_content_loss(generated_features, original_features):
    """
    Calculates the Content Loss using Mean Squared Error (MSE).
    
    Args:
        generated_features: The conv4_2 feature map of the image we are generating/updating.
        original_features: The fixed conv4_2 feature map of the original user photo (McGregor).
        
    Returns:
        A single number representing how structurally different the two images are.
    """
    # Mean Squared Error: 
    # 1. Subtract the original from the generated (find the difference)
    # 2. Square the difference (makes negative differences positive, and heavily penalizes large mistakes)
    # 3. Take the mean (average) of all those numbers
    
    mse_loss = nn.MSELoss()
    loss = mse_loss(generated_features, original_features)
    
    return loss
