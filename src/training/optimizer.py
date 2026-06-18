import torch.optim as optim

def get_lbfgs_optimizer(generated_image):
    """
    Initializes the L-BFGS optimizer for Neural Style Transfer.
    
    Args:
        generated_image: The PyTorch tensor of the image we are painting.
                         This tensor MUST have requires_grad=True.
        
    Returns:
        The optimizer configured to ONLY update the pixels of the generated_image.
    """
    # L-BFGS requires the parameters to be wrapped in a list or iterable.
    # We pass the image itself, because we want the optimizer to change the pixel values,
    # NOT the neural network's weights.
    optimizer = optim.LBFGS(
        [generated_image],
        max_iter=50,       # The optimizer will take 50 sub-steps per major step
        max_eval=50,
        tolerance_grad=1e-5,
        tolerance_change=1e-5,
        history_size=10,
        line_search_fn="strong_wolfe" # Helps the math stabilize so the colors don't explode
    )
    
    return optimizer
