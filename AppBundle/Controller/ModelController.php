<?php
/*
 * (c) Kauths.com
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
//namespace AppBundle/Controller

/**
 * @author Marie Kauth 03/07/2017
 */
class ModelController
{
    /*
     * @param string $company
     * @param string $modelName
     * @param array $args
     * @param string $namespace
     */
	public function write($company, $modelName, $args, $namespace)
    {
        $str =  '/*<br>';
        $str .= ' * (c) ' . $company . '<br>';
        $str .= ' *<br>';
        $str .= ' * For the full copyright and license information, please view the LICENSE<br>';
        $str .= ' * file that was distributed with this source code.<br>';
        $str .= ' */<br>';
        $str .= 'namespace ' . $namespace . '<br>';
        $str .= '<br>';
        $str .= '/**<br>';
        $str .= ' * @author Marie Kauth <marie.kauth@gmail.com><br>';
        $str .= ' */<br>';
        $str .= 'class ' . $modelName . '<br>';
		$str .= '{<br>';
		
        foreach ($args as $arg => $type) {
    	    $str .= '<br>';
    	    $str .= '&nbsp;&nbsp;&nbsp;&nbsp;/** @param ' . $type . ' $' . $arg . '*/<br>';
    	    $str .= '&nbsp;&nbsp;&nbsp;&nbsp;private $' . $arg . ';<br>';
        }
		
        foreach ($args as $arg => $type) {
            $str .= '<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp;/**<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp; * @return ' . $type . '<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp; */<br>';
    	    if ($type === 'bool' || $type === 'boolean') {
                $str .= '&nbsp;&nbsp;&nbsp;&nbsp;public function is' . ucfirst($arg) . '()<br>';
	        } else {
                $str .= '&nbsp;&nbsp;&nbsp;&nbsp;public function get' . ucfirst($arg) . '()<br>';
	        }
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp;{<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return $this->' . $arg . ';<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp}<br>';
            $str .= '<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp;/**<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp; * @param ' . $type . ' $' . $arg . '<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp; */<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp;public function set' . ucfirst($arg) . '($' . $arg . ')<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp;{<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp$this->' . $arg . ' = $' . $arg . ';<br>';
            $str .= '&nbsp;&nbsp;&nbsp;&nbsp;}<br>';	
        }
		
	    $str .= '}<br>';
		$str .= '<br>';
		
		return $str;
    }
}
