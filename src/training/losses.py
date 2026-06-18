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

def calc_style_loss(generated_gram_matrices, original_gram_matrices):
    """
    Calculates the Style Loss using Mean Squared Error (MSE) on Gram Matrices.
    
    Args:
        generated_gram_matrices: Dictionary of the 5 Gram Matrices from the generated image.
        original_gram_matrices: Dictionary of the 5 Gram Matrices from the style painting (Icarus).
        
    Returns:
        A single number representing how different the textures/brush strokes are.
    """
    mse_loss = nn.MSELoss()
    style_loss = 0
    
    # We have 5 different style layers. We need to calculate the MSE for each
    # layer individually, and then add them all together for the final score.
    for layer in generated_gram_matrices:
        gen_gram = generated_gram_matrices[layer]
        orig_gram = original_gram_matrices[layer]
        
        # Calculate MSE for this specific layer's Gram Matrix
        layer_loss = mse_loss(gen_gram, orig_gram)
        
        # Add it to the total score
        # We divide by 5 so each layer contributes equally (20%) to the final score
        style_loss += layer_loss / 5.0
        
    return style_loss
